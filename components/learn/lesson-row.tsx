import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { lessonImages } from '@/constants/images';
import { STATUS_LABELS, type LessonStatus } from '@/lib/lesson-status';
import type { Lesson } from '@/types/learning';

export const placeholderLessonImage = {
  uri: 'https://picsum.photos/seed/lingua-lesson/900/520',
};

type LessonRowProps = {
  lesson: Lesson;
  lessonNumber: number;
  onPress: () => void;
  status: LessonStatus;
};

export function LessonRow({ lesson, lessonNumber, onPress, status }: LessonRowProps) {
  const isInProgress = status === 'in-progress';
  const isCompleted = status === 'completed';
  const lessonImage = lessonImages[lesson.id] ?? placeholderLessonImage;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open lesson ${lessonNumber}, ${lesson.title}`}
      className={`min-h-[112px] flex-row items-center rounded-[18px] border bg-white px-[25px] ${
        isInProgress ? 'border-[2px] border-[#9B83FF] bg-[#FDFCFF]' : 'border-[#EEF0F6]'
      }`}
      onPress={onPress}
      style={styles.lessonCard}>
      <View className="min-w-0 flex-1">
        <Text
          className={`font-lingua-bold text-[17px] leading-[24px] ${
            isInProgress ? 'text-[#6C4EF5]' : 'text-[#8790A8]'
          }`}>
          Lesson {lessonNumber}
        </Text>
        <Text
          className="mt-[11px] font-lingua-semibold text-[20px] leading-[27px] text-[#071033]"
          numberOfLines={1}>
          {lesson.title}
        </Text>
        {!isCompleted ? (
          <Text
            className={`mt-[4px] font-lingua-semibold text-[17px] leading-[24px] ${
              isInProgress ? 'text-[#6C4EF5]' : 'text-[#7E879F]'
            }`}>
            {STATUS_LABELS[status]}
          </Text>
        ) : null}
      </View>

      <View className="ml-[18px] h-[58px] w-[58px] items-center justify-center">
        {isCompleted ? (
          <View className="h-[33px] w-[33px] items-center justify-center rounded-[17px] bg-[#25C20F]">
            <Ionicons name="checkmark" size={26} color="#FFFFFF" />
          </View>
        ) : null}
        {isInProgress ? (
          <Image source={lessonImage} style={styles.lessonThumb} contentFit="cover" />
        ) : null}
        {status === 'upcoming' ? (
          <View className="h-[30px] w-[30px] items-center justify-center rounded-[6px] border-[2px] border-[#6E7896] bg-white">
            <Ionicons name="lock-closed" size={18} color="#6E7896" />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lessonCard: {
    boxShadow: '0 2px 12px rgba(13, 19, 43, 0.05)',
  },
  lessonThumb: {
    borderRadius: 12,
    height: 48,
    width: 48,
  },
});
