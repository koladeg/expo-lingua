import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';
import {
  CallingState,
  useCallStateHooks,
  useConnectedUser,
  type Call,
} from '@stream-io/video-react-native-sdk';

export type AudioCallStatus = 'connecting' | 'joined' | 'ended' | 'error';

function mapCallingState(callingState: CallingState): AudioCallStatus {
  switch (callingState) {
    case CallingState.JOINED:
      return 'joined';
    case CallingState.LEFT:
      return 'ended';
    case CallingState.RECONNECTING_FAILED:
    case CallingState.OFFLINE:
      return 'error';
    default:
      return 'connecting';
  }
}

/**
 * Drives the in-call UI once a Call instance exists inside <StreamCall>.
 * Joins on mount, exposes mic state + call status, and keeps the lesson's
 * cosmetic AI-teacher phrase-cycling UI (unrelated to the real Stream call).
 */
export function useAudioCallControls(call: Call, phraseCount: number) {
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { microphone, isMute } = useMicrophoneState();
  const connectedUser = useConnectedUser();

  const [joinError, setJoinError] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const speakerScale = useRef(new Animated.Value(1)).current;
  const joinedAtRef = useRef<number | null>(null);

  const attemptJoin = useCallback(async () => {
    setJoinError(null);

    try {
      await call.camera.disable();
      await call.microphone.enable();
      await call.join();
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'Could not join the call.');
    }
  }, [call]);

  useEffect(() => {
    void attemptJoin();

    return () => {
      call.leave().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call]);

  const status: AudioCallStatus = joinError ? 'error' : mapCallingState(callingState);

  useEffect(() => {
    if (status === 'joined' && joinedAtRef.current === null) {
      joinedAtRef.current = Date.now();
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'joined') {
      return;
    }

    const interval = setInterval(() => {
      if (joinedAtRef.current) {
        setElapsedSeconds(Math.floor((Date.now() - joinedAtRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(
    elapsedSeconds % 60,
  ).padStart(2, '0')}`;

  const playCurrentPhrase = useCallback(() => {
    if (status !== 'joined') {
      return;
    }

    setIsSpeaking(true);
    Animated.sequence([
      Animated.timing(speakerScale, { toValue: 1.2, duration: 180, useNativeDriver: true }),
      Animated.timing(speakerScale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setIsSpeaking(false);
      setPhraseIndex((index) => (phraseCount > 0 ? (index + 1) % phraseCount : 0));
    });
  }, [phraseCount, speakerScale, status]);

  const toggleMic = useCallback(() => {
    if (status !== 'joined') {
      return;
    }
    void microphone.toggle();
  }, [microphone, status]);

  const toggleSubtitles = useCallback(() => setShowSubtitles((visible) => !visible), []);

  const handleCameraPress = useCallback(() => {
    if (isCameraOn) {
      setIsCameraOn(false);
      return;
    }
    Alert.alert('Audio-only lesson', "Video isn't available in this lesson yet.");
  }, [isCameraOn]);

  const handleEndCall = useCallback(() => {
    Alert.alert('End lesson?', 'You can pick up where you left off any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End lesson',
        style: 'destructive',
        onPress: () => {
          call.leave().catch(() => {});
        },
      },
    ]);
  }, [call]);

  const leaveAfterError = useCallback(() => router.back(), []);

  return {
    connectedUser,
    formattedTime,
    handleCameraPress,
    handleEndCall,
    isCameraOn,
    isMuted: isMute,
    isSpeaking,
    joinError,
    leaveAfterError,
    phraseIndex,
    playCurrentPhrase,
    retryJoin: attemptJoin,
    showSubtitles,
    speakerScale,
    status,
    toggleMic,
    toggleSubtitles,
  };
}
