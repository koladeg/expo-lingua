import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { lessonImages } from '@/constants/images';
import { lessons } from '@/data/lessons';

const placeholderLessonImage = {
  uri: 'https://picsum.photos/seed/lingua-detail/900/520',
};

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = useMemo(
    () => lessons.find((currentLesson) => currentLesson.id === lessonId),
    [lessonId],
  );

  if (!lesson) {
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View className="px-[25px] pb-[34px] pt-[18px]">
          <Pressable
            accessibilityLabel="Go back"
            className="h-[44px] w-[44px] items-start justify-center"
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={34} color="#061032" />
          </Pressable>

          <Image
            source={lessonImages[lesson.id] ?? placeholderLessonImage}
            style={styles.heroImage}
            contentFit="cover"
          />

          <Text className="mt-[24px] font-lingua-bold text-[30px] leading-[38px] text-[#061032]">
            {lesson.title}
          </Text>
          <Text className="mt-[8px] font-lingua-regular text-[17px] leading-[26px] text-[#69728F]">
            {lesson.description}
          </Text>

          <View className="mt-[22px] flex-row gap-[12px]">
            <View className="flex-1 rounded-[18px] bg-[#F6F4FF] px-[18px] py-[16px]">
              <Text className="font-lingua-bold text-[24px] leading-[30px] text-[#6C4EF5]">
                {lesson.xpReward}
              </Text>
              <Text className="mt-[2px] font-lingua-semibold text-[14px] leading-[20px] text-[#69728F]">
                XP reward
              </Text>
            </View>
            <View className="flex-1 rounded-[18px] bg-[#F4FBEF] px-[18px] py-[16px]">
              <Text className="font-lingua-bold text-[24px] leading-[30px] text-[#25C20F]">
                {lesson.estimatedMinutes}m
              </Text>
              <Text className="mt-[2px] font-lingua-semibold text-[14px] leading-[20px] text-[#69728F]">
                Practice time
              </Text>
            </View>
          </View>

          <Text className="mt-[28px] font-lingua-bold text-[22px] leading-[30px] text-[#061032]">
            Goals
          </Text>
          <View className="mt-[14px] gap-[12px]">
            {lesson.goals.map((goal) => (
              <View key={goal.id} className="flex-row items-start gap-[12px]">
                <View className="mt-[3px] h-[24px] w-[24px] items-center justify-center rounded-[12px] bg-[#25C20F]">
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
                <Text className="flex-1 font-lingua-medium text-[16px] leading-[24px] text-[#27304F]">
                  {goal.text}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-[28px] font-lingua-bold text-[22px] leading-[30px] text-[#061032]">
            Vocabulary
          </Text>
          <View className="mt-[14px] gap-[10px]">
            {lesson.vocabulary.map((item) => (
              <View
                key={item.id}
                className="rounded-[18px] border border-[#EEF0F6] bg-white px-[18px] py-[14px]">
                <Text className="font-lingua-bold text-[18px] leading-[25px] text-[#061032]">
                  {item.term}
                </Text>
                <Text className="mt-[2px] font-lingua-medium text-[15px] leading-[22px] text-[#69728F]">
                  {item.translation} • {item.pronunciation}
                </Text>
              </View>
            ))}
          </View>

          <Pressable className="mt-[30px] h-[66px] items-center justify-center rounded-[21px] bg-[#6C4EF5]">
            <Text className="font-lingua-bold text-[20px] leading-[27px] text-white">
              Start lesson
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  heroImage: {
    borderRadius: 24,
    height: 220,
    marginTop: 18,
    width: '100%',
  },
});
