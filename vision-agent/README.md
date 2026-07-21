# vision-agent

Voice-only AI language teacher for the Kola Lingo app, built with
[Vision Agents](https://visionagents.ai). Uses OpenAI Realtime as the LLM and
Stream Edge for transport. The teacher always speaks English and teaches the
selected language through English.

## Setup

1. Copy `.env.example` to `.env` and fill in the keys (reuse
   `STREAM_API_KEY`/`STREAM_API_SECRET` from the app's root `.env`, add your
   own `OPENAI_API_KEY`). Set `AGENT_SERVICE_API_KEY` to the same value as
   the Expo app's `AGENT_SERVICE_API_KEY` env var to require that shared
   secret on the `serve` HTTP API; leave both unset for local dev.
2. Install dependencies:

   ```bash
   uv sync
   ```

3. Run the agent:

   ```bash
   uv run agent.py run     # single-call console
   uv run agent.py serve   # HTTP server
   ```

4. Run the tests:

   ```bash
   uv run pytest
   ```

## How it joins a lesson call

The Expo app creates the Stream call before the teacher joins (see
`app/api/stream/audio-call+api.ts`), using call type `audio_room` and call id
`audio-{lessonId}-{userId}`, with the lesson's language, goals, vocabulary,
phrases, and AI teacher prompt stored as call custom data. The learner is
added as a `host` member so their mic keeps working under `audio_room`'s
permission model.

The Expo app's `/api/agent/start` and `/api/agent/stop` routes (see
`app/api/agent/`) are the only intended callers of this service — they proxy
to it using `AGENT_SERVICE_URL`/`AGENT_SERVICE_API_KEY`, so the mobile app
never talks to it directly. To call it by hand in `serve` mode:

```bash
curl -X POST http://localhost:8000/calls/audio-<lessonId>-<userId>/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AGENT_SERVICE_API_KEY" \
  -d '{"call_type": "audio_room"}'
```

`join_call` in `agent.py`:

1. Reads the call's custom data back to personalize the teacher's
   instructions with the lesson's language, goals, vocabulary, phrases, and
   persona.
2. Grants the teacher's Stream user the `admin` role on the call and calls
   `go_live()`, since `audio_room` starts in "backstage" and only
   speaker/host/admin roles can publish audio.

## Docker

```bash
docker build -t vision-agent .
docker run --env-file .env -p 8000:8000 vision-agent
```
