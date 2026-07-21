import { useAuth, useUser } from '@clerk/expo';
import { StreamVideoClient, type Call } from '@stream-io/video-react-native-sdk';
import { useCallback, useEffect, useRef, useState } from 'react';

import { requestAudioCallCredentials } from '@/lib/stream';
import type { LearningLanguage, Lesson } from '@/types/learning';

export type AudioCallSessionPhase = 'loading' | 'ready' | 'error';
const AUDIO_CALL_SETUP_TIMEOUT_MS = 45_000;
const SETUP_TIMEOUT_MESSAGE =
  'Your AI teacher is taking too long to respond. Check your connection and try again.';

/**
 * Fetches a Stream token + call id for this lesson from the server, then
 * creates the StreamVideoClient and Call instance. Runs before any
 * <StreamVideo>/<StreamCall> context exists, so it never touches call state
 * hooks — those live in useAudioCallControls once the call is ready.
 */
export function useAudioCallSession(lesson: Lesson, language: LearningLanguage) {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [phase, setPhase] = useState<AudioCallSessionPhase>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const [attempt, setAttempt] = useState(0);

  const displayName = user?.fullName ?? user?.firstName ?? undefined;
  const imageUrl = user?.imageUrl;

  // @clerk/expo's useAuth() returns a new getToken function identity on
  // every render (it's not memoized). Reading it through a ref keeps the
  // setup effect below from re-running mid-join whenever call state changes
  // re-render this hook's owner — which was spawning a second, colliding
  // join for the same call id.
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  useEffect(() => {
    let cancelled = false;
    let timedOut = false;

    setPhase('loading');
    setErrorMessage(null);
    setClient(undefined);
    setCall(undefined);

    const setupTimeout = setTimeout(() => {
      timedOut = true;

      if (!cancelled) {
        setErrorMessage(SETUP_TIMEOUT_MESSAGE);
        setPhase('error');
      }
    }, AUDIO_CALL_SETUP_TIMEOUT_MS);

    async function setup() {
      try {
        const credentials = await requestAudioCallCredentials({
          getToken: () => getTokenRef.current(),
          lessonId: lesson.id,
          languageId: language.id,
          displayName,
          imageUrl,
        });

        if (cancelled || timedOut) {
          return;
        }

        const nextClient = StreamVideoClient.getOrCreateInstance({
          apiKey: credentials.apiKey,
          token: credentials.token,
          user: {
            id: credentials.userId,
            name: displayName,
            image: imageUrl ?? undefined,
          },
          options: {
            // SDK join-telemetry beacon posts anonymously and easily hits its
            // own rate limit in dev; disabling it avoids noisy 429s in logs.
            clientEventsReportingEnabled: false,
          },
        });

        const nextCall = nextClient.call(credentials.callType, credentials.callId);

        setClient(nextClient);
        setCall(nextCall);
        setPhase('ready');
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (timedOut) {
          setErrorMessage(SETUP_TIMEOUT_MESSAGE);
          setPhase('error');
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Could not start this lesson call.',
        );
        setPhase('error');
      } finally {
        clearTimeout(setupTimeout);
      }
    }

    void setup();

    return () => {
      cancelled = true;
      clearTimeout(setupTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, lesson.id, language.id, displayName, imageUrl]);

  useEffect(() => {
    return () => {
      void client?.disconnectUser();
    };
  }, [client]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { phase, errorMessage, client, call, retry };
}
