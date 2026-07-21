import logging
import os
from typing import Any, Optional

from dotenv import load_dotenv
from fastapi import Header, HTTPException, status
from getstream.models import MemberRequest
from vision_agents.core import Agent, Runner, ServeOptions, User
from vision_agents.core.agents import AgentLauncher
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import getstream, openai

load_dotenv()

logger = logging.getLogger(__name__)

DEFAULT_LANGUAGE_NAME = "Spanish"

# The teacher always speaks English, and teaches the target language through
# English explanations — never switches its own speaking language.
BASE_INSTRUCTIONS = (
    "You are a friendly AI language teacher hosting a live, voice-only lesson "
    "inside a language-learning app.\n\n"
    "- Always speak English yourself, no matter what language the learner uses.\n"
    "- Teach {language_name} through English: say a {language_name} word or "
    "phrase, explain what it means in English, then ask the learner to repeat "
    "it out loud.\n"
    "- Keep replies short (1-3 sentences) — this is a spoken conversation, not "
    "a chat.\n"
    "- Be warm, encouraging, and patient. Celebrate small wins.\n"
    "- Never use markdown, bullet points, or special characters — everything "
    "you say is spoken aloud."
)

INSTRUCTIONS = BASE_INSTRUCTIONS.format(language_name=DEFAULT_LANGUAGE_NAME)


def build_instructions(custom: dict[str, Any]) -> str:
    """Personalize the base instructions with this lesson's full content.

    `custom` comes from the Stream call's custom data, which the Expo app
    sets when it creates the call — see app/api/stream/audio-call+api.ts
    (lessonTitle, goals, vocabulary, phrases, aiTeacherPrompt, etc).
    """
    language_name = custom.get("languageName") or DEFAULT_LANGUAGE_NAME
    parts = [BASE_INSTRUCTIONS.format(language_name=language_name)]

    lesson_title = custom.get("lessonTitle")
    if lesson_title:
        parts.append(
            f'Today\'s lesson is "{lesson_title}". Focus on the vocabulary and '
            "phrases below rather than improvising your own."
        )

    ai_teacher_prompt = custom.get("aiTeacherPrompt") or {}

    persona = ai_teacher_prompt.get("persona")
    if persona:
        parts.append(f"Persona: {persona}")

    lesson_brief = ai_teacher_prompt.get("lessonBrief")
    if lesson_brief:
        parts.append(f"Lesson brief: {lesson_brief}")

    teaching_steps = ai_teacher_prompt.get("teachingSteps") or []
    if teaching_steps:
        steps = "\n".join(
            f"{index}. {step}" for index, step in enumerate(teaching_steps, start=1)
        )
        parts.append(f"Walk through these teaching steps, in order:\n{steps}")

    correction_style = ai_teacher_prompt.get("correctionStyle")
    if correction_style:
        parts.append(f"When correcting the learner: {correction_style}")

    goals = custom.get("goals") or []
    goal_texts = [goal.get("text") for goal in goals if goal.get("text")]
    if goal_texts:
        goals_list = "\n".join(f"- {text}" for text in goal_texts)
        parts.append(f"By the end of the lesson, the learner should be able to:\n{goals_list}")

    vocabulary = custom.get("vocabulary") or []
    if vocabulary:
        vocab_list = "\n".join(
            f"- {item.get('term')} ({item.get('pronunciation')}) = {item.get('translation')}"
            for item in vocabulary
            if item.get("term")
        )
        parts.append(f"Vocabulary to teach:\n{vocab_list}")

    phrases = custom.get("phrases") or []
    if phrases:
        phrase_list = "\n".join(
            f"- {phrase.get('text')} ({phrase.get('pronunciation')}) = {phrase.get('translation')}"
            for phrase in phrases
            if phrase.get("text")
        )
        parts.append(f"Phrases to practice out loud with the learner:\n{phrase_list}")

    return "\n\n".join(parts)


async def create_agent(**kwargs) -> Agent:
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Teacher", id="ai-teacher"),
        instructions=INSTRUCTIONS,
        llm=openai.Realtime(voice="marin", send_video=False),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)

    # The call already exists (the Expo app created it), so read back its
    # custom data to find out which language/lesson to teach.
    try:
        response = await call.get()
        custom = response.data.call.custom or {}
    except Exception:
        logger.exception(
            "Failed to read call custom data for %s; using defaults", call_id
        )
        custom = {}

    agent.instructions = Instructions(input_text=build_instructions(custom))

    # The "audio_room" call type (see app/api/stream/audio-call+api.ts)
    # starts in "backstage" and only lets speaker/host/admin roles publish
    # audio. Grant the teacher's Stream user "admin" on this specific call
    # and take the call live so it's actually allowed to speak — the
    # learner is already added as "host" when the call is created.
    try:
        await call.update_call_members(
            update_members=[MemberRequest(user_id=agent.agent_user.id, role="admin")]
        )
        await call.go_live()
    except Exception:
        logger.exception(
            "Failed to grant admin/go-live permissions on call %s; the "
            "teacher may not be able to speak",
            call_id,
        )

    async with agent.join(call):
        await agent.simple_response(
            text="Greet the learner warmly in English and introduce today's lesson."
        )
        await agent.finish()


def _require_agent_service_api_key(
    call_id: str, authorization: Optional[str] = Header(default=None)
) -> None:
    """Shared-secret check for the `serve` HTTP API.

    The Vision Agents server has no built-in auth, so the Expo app's
    /api/agent/start and /api/agent/stop routes (the only allowed callers —
    see lib/agent-server.ts) send this shared secret instead. Set
    AGENT_SERVICE_API_KEY the same way in both this service's .env and the
    Expo app's server env to enable it; leave both unset for local dev.
    """
    expected_key = os.environ.get("AGENT_SERVICE_API_KEY")
    if not expected_key:
        return

    if authorization != f"Bearer {expected_key}":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid agent service credentials",
        )


runner = Runner(
    AgentLauncher(create_agent=create_agent, join_call=join_call),
    serve_options=ServeOptions(
        can_start_session=_require_agent_service_api_key,
        can_close_session=_require_agent_service_api_key,
        can_view_session=_require_agent_service_api_key,
    ),
)


if __name__ == "__main__":
    runner.cli()
