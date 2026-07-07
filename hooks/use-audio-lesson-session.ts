import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from 'react-native';

export function useAudioLessonSession(phraseCount: number) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const speakerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => setIsConnecting(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(
    elapsedSeconds % 60,
  ).padStart(2, '0')}`;

  const playCurrentPhrase = () => {
    setIsSpeaking(true);
    Animated.sequence([
      Animated.timing(speakerScale, { toValue: 1.2, duration: 180, useNativeDriver: true }),
      Animated.timing(speakerScale, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setIsSpeaking(false);
      setPhraseIndex((index) => (phraseCount > 0 ? (index + 1) % phraseCount : 0));
    });
  };

  const handleEndCall = () => {
    Alert.alert('End lesson?', 'You can pick up where you left off any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End lesson', style: 'destructive', onPress: () => router.back() },
    ]);
  };

  const handleCameraPress = () => {
    if (isCameraOn) {
      setIsCameraOn(false);
      return;
    }

    Alert.alert('Audio-only lesson', "Video isn't available in this lesson yet.");
  };

  const toggleMic = () => setIsMuted((muted) => !muted);
  const toggleSubtitles = () => setShowSubtitles((visible) => !visible);

  return {
    formattedTime,
    handleCameraPress,
    handleEndCall,
    isCameraOn,
    isConnecting,
    isMuted,
    isSpeaking,
    phraseIndex,
    playCurrentPhrase,
    showSubtitles,
    speakerScale,
    toggleMic,
    toggleSubtitles,
  };
}
