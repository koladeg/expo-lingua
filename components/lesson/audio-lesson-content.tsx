import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Call } from '@stream-io/video-react-native-sdk';

import { ControlButton } from '@/components/lesson/control-button';
import { images } from '@/constants/images';
import { useAgentSession } from '@/hooks/use-agent-session';
import { useAudioCallControls } from '@/hooks/use-audio-call-controls';
import { useLiveCaptions } from '@/hooks/use-live-captions';
import { colors } from '@/theme';
import type { LearningLanguage, Lesson } from '@/types/learning';

const sessionFeedback = [
  { label: 'Speaking', value: 'Excellent', color: '#25C20F' },
  { label: 'Pronunciation', value: 'Great', color: '#4D8BFF' },
  { label: 'Grammar', value: 'Good', color: '#6C4EF5' },
];

type AudioLessonContentProps = {
  call: Call;
  lesson: Lesson;
  language: LearningLanguage;
};

export function AudioLessonContent({ call, lesson, language }: AudioLessonContentProps) {
  const session = useAudioCallControls(call, lesson.phrases.length);
  const agentSession = useAgentSession(lesson.id, call);
  const liveCaptions = useLiveCaptions();
  const latestCaption = liveCaptions[liveCaptions.length - 1];
  const currentPhrase = lesson.phrases[session.phraseIndex % lesson.phrases.length];

  // Ending the call doesn't unmount this screen (it shows the "Lesson
  // ended" state below), so the agent session's own unmount cleanup won't
  // fire — stop it explicitly here instead.
  useEffect(() => {
    if (session.status === 'ended') {
      agentSession.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, agentSession.stop]);

  const statusLabel = useMemo(() => {
    switch (session.status) {
      case 'connecting':
        return 'Connecting…';
      case 'ended':
        return 'Call ended';
      case 'error':
        return "Couldn't connect";
      default:
        switch (agentSession.status) {
          case 'connected':
            return 'AI teacher online';
          case 'failed':
            return 'AI teacher unavailable';
          default:
            return 'AI teacher joining…';
        }
    }
  }, [session.status, agentSession.status]);

  const statusDotColor =
    session.status === 'error'
      ? colors.error
      : session.status !== 'joined'
        ? '#FFC800'
        : agentSession.status === 'connected'
          ? '#25C20F'
          : agentSession.status === 'failed'
            ? colors.error
            : '#FFC800';

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-[20px] pb-[8px] pt-[4px]">
        <Pressable
          accessibilityLabel="Go back"
          className="h-[40px] w-[40px] items-center justify-center"
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061032" />
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="font-lingua-bold text-[18px] leading-[24px] text-[#061032]">
            AI Teacher
          </Text>
          <View className="mt-[2px] flex-row items-center gap-[6px]">
            <View className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: statusDotColor }} />
            <Text className="font-lingua-semibold text-[13px] leading-[18px] text-[#69728F]">
              {statusLabel}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-[8px]">
          {session.connectedUser ? (
            <View className="flex-row items-center gap-[6px] rounded-full bg-[#F6F7FB] px-[6px] py-[4px]">
              {session.connectedUser.image ? (
                <Image
                  source={{ uri: session.connectedUser.image }}
                  style={styles.userAvatar}
                  accessibilityLabel="Your avatar"
                />
              ) : (
                <View style={styles.userAvatarFallback}>
                  <Ionicons name="person" size={12} color="#69728F" />
                </View>
              )}
              <Text
                className="font-lingua-semibold text-[12px] leading-[16px] text-[#061032]"
                numberOfLines={1}>
                {session.connectedUser.name ?? 'You'}
              </Text>
            </View>
          ) : null}
          <View className="flex-row items-center gap-[4px] rounded-full bg-[#F6F7FB] px-[10px] py-[7px]">
            <Ionicons name="time-outline" size={14} color="#69728F" />
            <Text className="font-lingua-semibold text-[12px] leading-[16px] text-[#69728F]">
              {session.formattedTime}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-[8px] px-[20px] pb-[6px]">
        <Image
          source={{ uri: language.flag.imageUrl }}
          style={styles.flag}
          accessibilityLabel={language.flag.alt}
        />
        <Text className="flex-1 font-lingua-bold text-[16px] leading-[22px] text-[#061032]" numberOfLines={1}>
          {lesson.title}
        </Text>
        <View className="flex-row items-center gap-[4px] rounded-full bg-[#F6F4FF] px-[10px] py-[5px]">
          <Ionicons name="flash" size={12} color="#6C4EF5" />
          <Text className="font-lingua-bold text-[12px] leading-[16px] text-[#6C4EF5]">
            +{lesson.xpReward} XP
          </Text>
        </View>
      </View>

      <View className="flex-1 px-[20px]">
        <View className="flex-1 overflow-hidden rounded-[28px]" style={styles.heroCard}>
          <Image
            source={images.aiTeacherStudioBackdrop}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <View style={styles.heroWash} />

          <Image
            source={images.mascotWelcome}
            style={styles.mascotImage}
            contentFit="contain"
            accessibilityLabel="AI teacher avatar"
          />

          {session.status === 'connecting' ? (
            <View className="absolute inset-0 items-center justify-center">
              <View className="items-center gap-[10px] rounded-[22px] bg-white/90 px-[24px] py-[20px]">
                <ActivityIndicator color="#6C4EF5" />
                <Text className="font-lingua-semibold text-[14px] leading-[19px] text-[#061032]">
                  Connecting to your AI teacher…
                </Text>
              </View>
            </View>
          ) : null}

          {session.status === 'error' ? (
            <View className="absolute inset-0 items-center justify-center px-[24px]">
              <View className="w-full items-center gap-[12px] rounded-[22px] bg-white px-[20px] py-[24px]" style={styles.bubbleShadow}>
                <Ionicons name="alert-circle" size={32} color={colors.error} />
                <Text className="text-center font-lingua-bold text-[16px] leading-[22px] text-[#061032]">
                  {session.joinError ?? 'We lost the connection to your AI teacher.'}
                </Text>
                <View className="mt-[4px] w-full flex-row gap-[10px]">
                  <Pressable
                    className="flex-1 items-center justify-center rounded-[14px] bg-[#F6F7FB] py-[12px]"
                    onPress={session.leaveAfterError}>
                    <Text className="font-lingua-bold text-[14px] leading-[19px] text-[#061032]">
                      Leave
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-1 items-center justify-center rounded-[14px] bg-[#6C4EF5] py-[12px]"
                    onPress={session.retryJoin}>
                    <Text className="font-lingua-bold text-[14px] leading-[19px] text-white">
                      Try again
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}

          {session.status === 'ended' ? (
            <View className="absolute inset-0 items-center justify-center px-[24px]">
              <View className="w-full items-center gap-[10px] rounded-[22px] bg-white px-[20px] py-[24px]" style={styles.bubbleShadow}>
                <Ionicons name="checkmark-circle" size={32} color="#25C20F" />
                <Text className="text-center font-lingua-bold text-[16px] leading-[22px] text-[#061032]">
                  Lesson ended
                </Text>
                <Text className="text-center font-lingua-regular text-[13px] leading-[18px] text-[#69728F]">
                  Nice work! You can pick this lesson up again any time.
                </Text>
                <Pressable
                  className="mt-[6px] w-full items-center justify-center rounded-[14px] bg-[#6C4EF5] py-[12px]"
                  onPress={() => router.back()}>
                  <Text className="font-lingua-bold text-[14px] leading-[19px] text-white">
                    Back to lessons
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {session.status === 'joined' ? (
            <View className="absolute bottom-[16px] left-[16px] right-[16px]">
              <View className="absolute bottom-[6px] left-[24px] h-[16px] w-[16px] rotate-45 rounded-[3px] bg-white" />
              <Pressable
                accessibilityLabel="Play teacher response"
                className="rounded-[22px] bg-white px-[18px] py-[14px]"
                style={styles.bubbleShadow}
                onPress={session.playCurrentPhrase}>
                <View className="flex-row items-start justify-between gap-[12px]">
                  <View className="flex-1">
                    <Text className="font-lingua-bold text-[18px] leading-[25px] text-[#061032]">
                      {currentPhrase.text}
                    </Text>
                    <Text className="mt-[2px] font-lingua-medium text-[15px] leading-[21px] text-[#69728F]">
                      {currentPhrase.translation} 👏
                    </Text>
                  </View>
                  <Animated.View style={{ transform: [{ scale: session.speakerScale }] }}>
                    <Ionicons
                      name={session.isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                      size={24}
                      color="#6C4EF5"
                    />
                  </Animated.View>
                </View>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      {session.status === 'joined' ? (
        <View className="px-[20px] pt-[14px]">
          {latestCaption ? (
            <View
              className="flex-row items-start gap-[8px] rounded-[16px] bg-white px-[14px] py-[10px]"
              style={styles.bubbleShadow}>
              <View
                className={`mt-[2px] rounded-full px-[8px] py-[3px] ${
                  latestCaption.isTeacher ? 'bg-[#F6F4FF]' : 'bg-[#EAF3FF]'
                }`}>
                <Text
                  className={`font-lingua-bold text-[10px] leading-[13px] ${
                    latestCaption.isTeacher ? 'text-[#6C4EF5]' : 'text-[#2D7DFF]'
                  }`}>
                  {latestCaption.isTeacher ? 'AI Teacher' : 'You'}
                </Text>
              </View>
              <Text className="flex-1 font-lingua-medium text-[14px] leading-[19px] text-[#061032]">
                {latestCaption.text}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-[8px] rounded-[16px] border border-dashed border-[#E3E6F0] px-[14px] py-[10px]">
              <Ionicons name="mic-outline" size={16} color="#B7BED0" />
              <Text className="flex-1 font-lingua-medium text-[13px] leading-[18px] text-[#B7BED0]">
                Live captions will appear here
              </Text>
            </View>
          )}
        </View>
      ) : null}

      {session.status === 'joined' || session.status === 'connecting' ? (
        <View className="flex-row items-center justify-evenly px-[16px] pt-[22px]">
          <ControlButton
            icon={session.isMuted ? 'mic-off' : 'mic'}
            label="Mic"
            active={!session.isMuted}
            tint={session.isMuted ? '#FF4D4F' : '#061032'}
            background={session.isMuted ? '#FFF1F0' : '#F6F7FB'}
            onPress={session.toggleMic}
          />
          <View className="items-center gap-[8px]">
            <Pressable
              accessibilityLabel="End call"
              className="h-[64px] w-[64px] items-center justify-center rounded-full"
              style={{ backgroundColor: colors.error }}
              onPress={session.handleEndCall}>
              <Ionicons name="call" size={26} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
            </Pressable>
            <Text className="font-lingua-semibold text-[13px] leading-[18px] text-[#061032]">
              End Call
            </Text>
          </View>
        </View>
      ) : null}

      <View className="mx-[20px] mb-[20px] mt-[20px] flex-row items-center rounded-[22px] border border-[#EEF0F6] bg-white py-[16px]" style={styles.feedbackShadow}>
        {sessionFeedback.map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center px-[4px] ${index !== 0 ? 'border-l border-[#EEF0F6]' : ''}`}>
            <Text
              className="font-lingua-bold text-[12px] leading-[16px] text-[#061032]"
              numberOfLines={1}>
              {item.label}
            </Text>
            <Text
              className="mt-[4px] font-lingua-bold text-[15px] leading-[20px]"
              numberOfLines={1}
              style={{ color: item.color }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flag: {
    borderRadius: 3,
    height: 16,
    width: 22,
  },
  heroCard: {
    boxShadow: '0 12px 30px rgba(13, 19, 43, 0.18)',
  },
  heroWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 15, 40, 0.18)',
  },
  mascotImage: {
    alignSelf: 'center',
    bottom: 92,
    height: '68%',
    position: 'absolute',
    width: '72%',
  },
  bubbleShadow: {
    boxShadow: '0 8px 20px rgba(13, 19, 43, 0.16)',
  },
  feedbackShadow: {
    boxShadow: '0 6px 18px rgba(13, 19, 43, 0.06)',
  },
  userAvatar: {
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  userAvatarFallback: {
    alignItems: 'center',
    backgroundColor: '#E9EBF3',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
});
