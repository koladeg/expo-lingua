import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ControlButton } from '@/components/lesson/control-button';
import { images } from '@/constants/images';
import { languages } from '@/data/languages';
import { lessons } from '@/data/lessons';
import { useAudioLessonSession } from '@/hooks/use-audio-lesson-session';
import { colors } from '@/theme';

const sessionFeedback = [
  { label: 'Speaking', value: 'Excellent', color: '#25C20F' },
  { label: 'Pronunciation', value: 'Great', color: '#4D8BFF' },
  { label: 'Grammar', value: 'Good', color: '#6C4EF5' },
];

export default function AudioLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = useMemo(() => lessons.find((currentLesson) => currentLesson.id === lessonId), [
    lessonId,
  ]);
  const language = useMemo(
    () => languages.find((currentLanguage) => currentLanguage.id === lesson?.languageId),
    [lesson],
  );

  const session = useAudioLessonSession(lesson?.phrases.length ?? 0);

  if (!lesson || !language) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center px-[28px]">
          <Text className="text-center font-lingua-bold text-[24px] leading-[32px] text-[#061032]">
            Lesson not found
          </Text>
          <Pressable
            className="mt-[20px] h-[54px] items-center justify-center rounded-[16px] bg-[#6C4EF5] px-[24px]"
            onPress={() => router.back()}>
            <Text className="font-lingua-bold text-[18px] leading-[24px] text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentPhrase = lesson.phrases[session.phraseIndex % lesson.phrases.length];

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <View
              className="h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: session.isConnecting ? '#FFC800' : '#25C20F' }}
            />
            <Text className="font-lingua-semibold text-[13px] leading-[18px] text-[#69728F]">
              {session.isConnecting ? 'Connecting…' : 'Online'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-[8px]">
          <View className="flex-row items-center gap-[4px] rounded-full bg-[#F6F7FB] px-[10px] py-[7px]">
            <Ionicons name="time-outline" size={14} color="#69728F" />
            <Text className="font-lingua-semibold text-[12px] leading-[16px] text-[#69728F]">
              {session.formattedTime}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Notifications"
            className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#F6F7FB]">
            <Ionicons name="notifications-outline" size={18} color="#061032" />
          </Pressable>
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

      <View className="gap-[6px] px-[20px] pb-[10px]">
        <View className="flex-row flex-wrap gap-[8px]">
          {lesson.goals.map((goal) => (
            <View
              key={goal.id}
              className="max-w-[260px] flex-row items-center gap-[4px] rounded-full bg-[#F4FBEF] px-[10px] py-[5px]">
              <Ionicons name="checkmark-circle" size={12} color="#25C20F" />
              <Text
                className="font-lingua-semibold text-[11px] leading-[15px] text-[#3E8E2F]"
                numberOfLines={1}>
                {goal.text}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center gap-[6px]">
          <Ionicons name="sparkles" size={12} color="#6C4EF5" />
          <Text
            className="flex-1 font-lingua-regular text-[12px] leading-[16px] text-[#8790A8]"
            numberOfLines={1}>
            {lesson.aiTeacherPrompt.persona}
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

          <View className="absolute bottom-[16px] left-[16px] right-[16px]">
            <View className="absolute bottom-[6px] left-[24px] h-[16px] w-[16px] rotate-45 rounded-[3px] bg-white" />
            <Pressable
              accessibilityLabel="Play teacher response"
              className="rounded-[22px] bg-white px-[18px] py-[14px]"
              style={styles.bubbleShadow}
              onPress={session.playCurrentPhrase}>
              {session.showSubtitles ? (
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
              ) : (
                <View className="flex-row items-center gap-[10px]">
                  <Animated.View style={{ transform: [{ scale: session.speakerScale }] }}>
                    <Ionicons name="volume-high" size={20} color="#6C4EF5" />
                  </Animated.View>
                  <Text className="font-lingua-semibold text-[14px] leading-[19px] text-[#69728F]">
                    Teacher is speaking…
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-evenly px-[16px] pt-[22px]">
        <ControlButton
          icon={session.isCameraOn ? 'videocam' : 'videocam-off'}
          label="Camera"
          active={session.isCameraOn}
          tint={session.isCameraOn ? '#6C4EF5' : '#061032'}
          background={session.isCameraOn ? '#F1EDFF' : '#F6F7FB'}
          onPress={session.handleCameraPress}
        />
        <ControlButton
          icon={session.isMuted ? 'mic-off' : 'mic'}
          label="Mic"
          active={!session.isMuted}
          tint={session.isMuted ? '#FF4D4F' : '#061032'}
          background={session.isMuted ? '#FFF1F0' : '#F6F7FB'}
          onPress={session.toggleMic}
        />
        <ControlButton
          icon="language-outline"
          label="Subtitles"
          active={session.showSubtitles}
          tint={session.showSubtitles ? '#6C4EF5' : '#061032'}
          background={session.showSubtitles ? '#F1EDFF' : '#F6F7FB'}
          onPress={session.toggleSubtitles}
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

      <View className="mx-[20px] mb-[20px] mt-[20px] flex-row items-center rounded-[22px] border border-[#EEF0F6] bg-white py-[16px]" style={styles.feedbackShadow}>
        {sessionFeedback.map((item, index) => (
          <View
            key={item.label}
            className={`flex-1 items-center ${index !== 0 ? 'border-l border-[#EEF0F6]' : ''}`}>
            <Text className="font-lingua-bold text-[15px] leading-[20px] text-[#061032]">
              {item.label}
            </Text>
            <Text className="mt-[4px] font-lingua-bold text-[15px] leading-[20px]" style={{ color: item.color }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
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
});
