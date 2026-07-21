"""Example tests for vision-agent using `vision_agents.testing`.

Run:
    uv run pytest
"""

import os

import pytest
from dotenv import load_dotenv

from agent import INSTRUCTIONS

from vision_agents.plugins import openai
from vision_agents.testing import LLMJudge, TestSession

load_dotenv()


pytestmark = [
    pytest.mark.integration,
    pytest.mark.skipif(
        not os.getenv("OPENAI_API_KEY"),
        reason="OPENAI_API_KEY not set",
    ),
]

MODEL = "gpt-4o-mini"


async def test_greeting_is_friendly():
    """Use `LLMJudge` to verify the agent's greeting intent."""
    judge = LLMJudge(openai.LLM(MODEL))

    async with TestSession(llm=openai.LLM(MODEL), instructions=INSTRUCTIONS) as session:
        response = await session.simple_response("Hi there!")

        assert response.output is not None
        assert response.duration_ms > 0
        assert len(response.chat_messages) >= 1

        verdict = await judge.evaluate(
            response.chat_messages[-1],
            intent="A friendly, short greeting from an AI language teacher",
        )
        assert verdict.success, verdict.reason


async def test_teaches_through_english():
    """The teacher should stay in English even when explaining another language."""
    judge = LLMJudge(openai.LLM(MODEL))

    async with TestSession(llm=openai.LLM(MODEL), instructions=INSTRUCTIONS) as session:
        response = await session.simple_response("Teach me how to say hello.")
        verdict = await judge.evaluate(
            response.chat_messages[-1],
            intent=(
                "A short, spoken-style reply in English that teaches a "
                "greeting in the target language, with no markdown or lists"
            ),
        )
        assert verdict.success, verdict.reason


async def test_remembers_context_across_turns():
    """Within one `TestSession`, conversation history accumulates."""
    judge = LLMJudge(openai.LLM(MODEL))

    async with TestSession(llm=openai.LLM(MODEL), instructions=INSTRUCTIONS) as session:
        await session.simple_response("My name is Alex.")
        response = await session.simple_response("What is my name?")

        verdict = await judge.evaluate(
            response.chat_messages[-1],
            intent="The assistant correctly recalls that the user's name is Alex",
        )
        assert verdict.success, verdict.reason
