import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LessonRow, placeholderLessonImage } from '@/components/learn/lesson-row';
import { images, lessonImages } from '@/constants/images';
import { languages } from '@/data/languages';
import { lessons } from '@/data/lessons';
import { units } from '@/data/units';
import { getMockLessonStatus } from '@/lib/lesson-status';
import { useLanguageStore } from '@/store/language-store';
import type { Lesson } from '@/types/learning';

export default function LearnScreen() {
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const [activeTab, setActiveTab] = useState<'lessons' | 'practice'>('lessons');

  const learnData = useMemo(() => {
    const selectedLanguage =
      languages.find((language) => language.id === selectedLanguageId) ?? languages[0];
    const languageUnits = units
      .filter((unit) => unit.languageId === selectedLanguage.id)
      .sort((firstUnit, secondUnit) => firstUnit.order - secondUnit.order);
    const currentUnit = languageUnits[0];
    const unitLessonIds = new Set<string>(currentUnit?.lessonIds ?? []);
    const unitLessons = lessons
      .filter((lesson) => lesson.languageId === selectedLanguage.id && unitLessonIds.has(lesson.id))
      .sort((firstLesson, secondLesson) => firstLesson.order - secondLesson.order);

    return {
      currentUnit,
      selectedLanguage,
      unitLessons,
    };
  }, [selectedLanguageId]);

  const highlightedLesson = learnData.unitLessons[2] ?? learnData.unitLessons[0];
  const highlightedImage = highlightedLesson
    ? lessonImages[highlightedLesson.id] ?? placeholderLessonImage
    : images.palace;
  const completedCount = Math.min(2, learnData.unitLessons.length);
  const unitProgressText = `${completedCount + (highlightedLesson ? 1 : 0)} / ${
    learnData.unitLessons.length
  } lessons`;

  const openLesson = (lesson: Lesson) => {
    router.push({
      pathname: lesson.mode === 'audio' ? '/lesson/audio/[lessonId]' : '/lesson/[lessonId]',
      params: {
        lessonId: lesson.id,
      },
    });
  };

  if (!learnData.currentUnit || !highlightedLesson) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View className="pb-[132px]">
          <View className="relative h-[456px] overflow-hidden bg-white">
            <Image source={highlightedImage} style={styles.heroImage} contentFit="cover" />
            <View style={styles.heroWash} />
            <View className="absolute left-[25px] right-[25px] top-[24px] z-10 flex-row items-start justify-between">
              <Pressable
                accessibilityLabel="Go back"
                className="h-[44px] w-[44px] items-start justify-center"
                onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={34} color="#061032" />
              </Pressable>

              <View className="min-w-0 flex-1 px-[11px]">
                <Text
                  className="font-lingua-bold text-[26px] leading-[34px] text-[#061032]"
                  numberOfLines={1}>
                  {highlightedLesson.title}
                </Text>
                <Text className="mt-[3px] font-lingua-semibold text-[19px] leading-[27px] text-[#707893]">
                  Unit {learnData.currentUnit.order} • {unitProgressText}
                </Text>
              </View>

              <View className="h-[44px] w-[44px] items-end justify-center">
                <View className="h-[38px] w-[28px] overflow-hidden rounded-[4px] border-[3px] border-[#6C4EF5] bg-white">
                  <View className="h-full w-full border-x-[7px] border-t-[7px] border-x-[#FFC43D] border-t-[#FFC43D]" />
                </View>
              </View>
            </View>

            <View className="absolute bottom-[72px] left-[143px] z-10 h-[132px] w-[132px] items-center justify-center">
              <Image source={images.mascotWelcome} style={styles.heroMascot} contentFit="contain" />
            </View>
          </View>

          <View className="-mt-[72px] px-[25px]">
            <View className="h-[80px] flex-row overflow-hidden rounded-[22px] bg-[#FBFAFF]">
              <Pressable
                className={`flex-1 items-center justify-center border-b-[4px] ${
                  activeTab === 'lessons' ? 'border-[#6C4EF5] bg-white' : 'border-transparent'
                }`}
                onPress={() => setActiveTab('lessons')}>
                <Text
                  className={`font-lingua-bold text-[22px] leading-[29px] ${
                    activeTab === 'lessons' ? 'text-[#6C4EF5]' : 'text-[#68708D]'
                  }`}>
                  Lessons
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 items-center justify-center border-b-[4px] ${
                  activeTab === 'practice' ? 'border-[#6C4EF5] bg-white' : 'border-transparent'
                }`}
                onPress={() => setActiveTab('practice')}>
                <Text
                  className={`font-lingua-bold text-[22px] leading-[29px] ${
                    activeTab === 'practice' ? 'text-[#6C4EF5]' : 'text-[#68708D]'
                  }`}>
                  Practice
                </Text>
              </Pressable>
            </View>

            <View className="mt-[27px] gap-[10px]">
              {learnData.unitLessons.map((lesson, index) => {
                const status = getMockLessonStatus(index);

                return (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    lessonNumber={index + 1}
                    status={status}
                    onPress={() => openLesson(lesson)}
                  />
                );
              })}
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  heroImage: {
    height: 456,
    width: '100%',
  },
  heroMascot: {
    height: 132,
    width: 132,
  },
  heroWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
