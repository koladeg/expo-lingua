import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StreamCall, StreamVideo } from '@stream-io/video-react-native-sdk';

import { AudioLessonContent } from '@/components/lesson/audio-lesson-content';
import { languages } from '@/data/languages';
import { lessons } from '@/data/lessons';
import { useAudioCallSession } from '@/hooks/use-audio-call-session';
import { colors } from '@/theme';
import type { LearningLanguage, Lesson } from '@/types/learning';

export default function AudioLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = useMemo(() => lessons.find((currentLesson) => currentLesson.id === lessonId), [
    lessonId,
  ]);
  const language = useMemo(
    () => languages.find((currentLanguage) => currentLanguage.id === lesson?.languageId),
    [lesson],
  );

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <AudioLessonSetup lesson={lesson} language={language} />
    </SafeAreaView>
  );
}

type AudioLessonSetupProps = {
  lesson: Lesson;
  language: LearningLanguage;
};

function AudioLessonSetup({ lesson, language }: AudioLessonSetupProps) {
  const session = useAudioCallSession(lesson, language);

  if (session.phase === 'loading') {
    return (
      <View className="flex-1">
        <Pressable
          accessibilityLabel="Go back"
          className="absolute left-[12px] top-[4px] z-10 h-[48px] w-[48px] items-center justify-center rounded-full bg-white"
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#061032" />
        </Pressable>

        <View className="flex-1 items-center justify-center gap-[14px] px-[28px]">
          <ActivityIndicator color="#6C4EF5" size="large" />
          <Text className="text-center font-lingua-semibold text-[16px] leading-[22px] text-[#061032]">
            Preparing your AI teacher…
          </Text>
          <Text className="text-center font-lingua-regular text-[14px] leading-[20px] text-[#69728F]">
            You can go back while we connect.
          </Text>
        </View>
      </View>
    );
  }

  if (session.phase === 'error' || !session.client || !session.call) {
    return (
      <View className="flex-1 items-center justify-center gap-[14px] px-[28px]">
        <Ionicons name="alert-circle" size={32} color={colors.error} />
        <Text className="text-center font-lingua-bold text-[18px] leading-[24px] text-[#061032]">
          {session.errorMessage ?? 'Could not start this lesson call.'}
        </Text>
        <View className="mt-[6px] w-full flex-row gap-[10px]">
          <Pressable
            className="flex-1 items-center justify-center rounded-[16px] bg-[#F6F7FB] py-[14px]"
            onPress={() => router.back()}>
            <Text className="font-lingua-bold text-[16px] leading-[22px] text-[#061032]">
              Go back
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 items-center justify-center rounded-[16px] bg-[#6C4EF5] py-[14px]"
            onPress={session.retry}>
            <Text className="font-lingua-bold text-[16px] leading-[22px] text-white">
              Try again
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <StreamVideo client={session.client}>
      <StreamCall call={session.call}>
        <AudioLessonContent call={session.call} lesson={lesson} language={language} />
      </StreamCall>
    </StreamVideo>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});
