import { useAuth } from '@clerk/expo';
import { useCallStateHooks, type Call } from '@stream-io/video-react-native-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AI_TEACHER_USER_ID, requestAgentSessionStart, requestAgentSessionStop } from '@/lib/agent';

export type AgentConnectionStatus = 'idle' | 'connecting' | 'connected' | 'failed';

const AGENT_JOIN_TIMEOUT_MS = 45_000;

/**
 * Starts the AI teacher agent on this lesson's call and tracks whether it
 * has actually joined (by watching for its Stream participant), rather than
 * just trusting that the start request was accepted. Stops the agent
 * session on unmount; callers should also call `stop()` explicitly when the
 * user ends the call, since ending a call doesn't unmount this screen.
 */
export function useAgentSession(lessonId: string, call: Call) {
  const { getToken } = useAuth();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const [status, setStatus] = useState<AgentConnectionStatus>('idle');
  const sessionIdRef = useRef<string | null>(null);

  // useAuth()'s getToken identity changes every render — read it through a
  // ref so the setup effect below only depends on lessonId/call.
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const stop = useCallback(() => {
    const sessionId = sessionIdRef.current;
    sessionIdRef.current = null;

    if (sessionId) {
      void requestAgentSessionStop({
        getToken: () => getTokenRef.current(),
        lessonId,
        sessionId,
      }).catch((error) => {
        console.error('Failed to stop the AI teacher agent', error);
      });
    }
  }, [lessonId]);

  useEffect(() => {
    let cancelled = false;
    setStatus('connecting');

    const joinTimeout = setTimeout(() => {
      if (!cancelled) {
        setStatus((current) => (current === 'connected' ? current : 'failed'));
      }
    }, AGENT_JOIN_TIMEOUT_MS);

    async function start() {
      try {
        const session = await requestAgentSessionStart({
          getToken: () => getTokenRef.current(),
          lessonId,
        });

        if (cancelled) {
          void requestAgentSessionStop({
            getToken: () => getTokenRef.current(),
            lessonId,
            sessionId: session.sessionId,
          }).catch(() => {});
          return;
        }

        sessionIdRef.current = session.sessionId;
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to start the AI teacher agent', error);
          setStatus('failed');
        }
      }
    }

    void start();

    return () => {
      cancelled = true;
      clearTimeout(joinTimeout);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, lessonId]);

  useEffect(() => {
    const agentJoined = participants.some((participant) => participant.userId === AI_TEACHER_USER_ID);

    if (agentJoined) {
      setStatus('connected');
    } else {
      // The agent hasn't joined yet (still connecting) or left after having
      // joined (lost connection) — either way, it's no longer connected.
      setStatus((current) => (current === 'connected' ? 'failed' : current));
    }
  }, [participants]);

  return { status, stop };
}
