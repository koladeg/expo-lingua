/**
 * Built-in Stream call type used for every audio lesson. Shared so the call
 * the learner joins and the call type the agent-session routes ask the
 * Vision Agent to join always match.
 */
export const AUDIO_CALL_TYPE = 'audio_room';

/**
 * Deterministic Stream call id for a learner's audio lesson. Shared by the
 * route that creates/joins the call and the routes that start/stop the AI
 * teacher agent on it, so both always agree on the same call id without the
 * client ever choosing it.
 */
export function buildAudioCallId(lessonId: string, userId: string) {
  return `audio-${lessonId}-${userId}`.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}
