import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '@/constants/images';
import { languages } from '@/data/languages';
import { lessons } from '@/data/lessons';
import { units } from '@/data/units';
import { useLanguageStore } from '@/store/language-store';
import type { LanguageId, LessonMode } from '@/types/learning';

const DAILY_GOAL_XP = 20;

const modeLabels: Record<LessonMode, string> = {
  audio: 'Lesson',
  chat: 'AI Conversation',
  video: 'AI Video Call',
  review: 'Review',
};

const modeIcons: Record<LessonMode, keyof typeof Ionicons.glyphMap> = {
  audio: 'book',
  chat: 'headset',
  video: 'videocam',
  review: 'albums',
};

const proficiencyLabels = {
  beginner: 'A1',
  elementary: 'A2',
  intermediate: 'B1',
};

const greetings: Record<LanguageId, string> = {
  spanish: 'Hola',
  french: 'Salut',
  yoruba: 'Bawo',
};

export default function HomeScreen() {
  const { isLoaded: isUserLoaded, user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  const homeData = useMemo(() => {
    const selectedLanguage = languages.find((language) => language.id === selectedLanguageId);

    if (!selectedLanguage) {
      return null;
    }

    const languageUnits = units
      .filter((unit) => unit.languageId === selectedLanguage.id)
      .sort((firstUnit, secondUnit) => firstUnit.order - secondUnit.order);
    const currentUnit = languageUnits[0];
    const unitLessons = lessons
      .filter((lesson) => lesson.languageId === selectedLanguage.id)
      .sort((firstLesson, secondLesson) => firstLesson.order - secondLesson.order);
    const currentUnitLessonIds = currentUnit?.lessonIds as readonly string[] | undefined;
    const currentLesson =
      unitLessons.find((lesson) => currentUnitLessonIds?.includes(lesson.id)) ?? unitLessons[0];

    if (!currentUnit || !currentLesson) {
      return null;
    }

    const nextLesson = unitLessons.find((lesson) => lesson.order > (currentLesson?.order ?? 0));
    const dailyXp = Math.min(
      DAILY_GOAL_XP,
      (currentLesson?.xpReward ?? 10) + (currentLesson?.vocabulary.length ?? 0) + 2,
    );

    return {
      currentLesson,
      currentUnit,
      dailyXp,
      nextLesson,
      selectedLanguage,
      unitLessons,
    };
  }, [selectedLanguageId]);

  const displayName = useMemo(() => {
    const clerkName =
      user?.firstName ?? user?.fullName ?? user?.username ?? user?.primaryEmailAddress?.emailAddress;
    const trimmedName = clerkName?.trim();

    return trimmedName && trimmedName.length > 0 ? trimmedName : 'Learner';
  }, [user]);

  if (!isUserLoaded || !user || !homeData) {
    return null;
  }

  const greeting = greetings[homeData.selectedLanguage.id];
  const unitProgress =
    homeData.unitLessons.length > 0
      ? Math.round(((homeData.currentLesson?.order ?? 1) / homeData.unitLessons.length) * 100)
      : 0;
  const currentLessonMode = homeData.currentLesson?.mode ?? 'audio';
  const nextUpLesson = homeData.nextLesson ?? homeData.currentLesson;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View className="px-[30px] pb-[132px] pt-[18px]">
          <View className="min-h-[50px] flex-row items-center justify-between gap-[14px]">
            <View className="min-w-0 flex-1 flex-row items-center gap-[14px]">
              <Image
                source={{ uri: homeData.selectedLanguage.flag.imageUrl }}
                style={styles.headerFlag}
                contentFit="cover"
                accessibilityLabel={homeData.selectedLanguage.flag.alt}
              />
              <Text
                className="min-w-0 flex-1 flex-wrap font-lingua-semibold text-[17px] leading-[23px] text-[#111633]"
                numberOfLines={2}>
                {greeting}, {displayName}! 👋
              </Text>
            </View>

            <View className="shrink-0 flex-row items-center gap-[21px]">
              <View className="flex-row items-center gap-[8px]">
                <Image
                  source={images.streakFire}
                  style={styles.streakFire}
                  contentFit="contain"
                />
                <Text className="font-lingua-semibold text-[20px] leading-[28px] text-[#2E3356]">
                  12
                </Text>
              </View>
              <Ionicons name="notifications-outline" size={31} color="#111633" />
            </View>
          </View>

          <View className="mt-[26px] h-[156px] flex-row items-center rounded-[22px] bg-[#FFF7EE] pl-[26px] pr-[22px]">
            <View className="flex-1">
              <Text className="font-lingua-semibold text-[19px] leading-[27px] text-[#2E3356]">
                Daily goal
              </Text>
              <View className="mt-[12px] flex-row items-end gap-[8px]">
                <Text className="font-lingua-bold text-[34px] leading-[40px] text-[#151A3A]">
                  {homeData.dailyXp}
                </Text>
                <Text className="pb-[4px] font-lingua-semibold text-[19px] leading-[25px] text-[#8891AD]">
                  / {DAILY_GOAL_XP} XP
                </Text>
              </View>
              <View className="mt-[21px] h-[9px] w-full overflow-hidden rounded-[5px] bg-[#FFE4C7]">
                <View
                  style={[
                    styles.dynamicGoalProgress,
                    { width: `${(homeData.dailyXp / DAILY_GOAL_XP) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <Image source={images.treasure} style={styles.treasure} contentFit="contain" />
          </View>

          <View className="mt-[28px] h-[215px] overflow-hidden rounded-[22px] bg-[#6948F6] pl-[26px]">
            <View className="max-w-[210px] pt-[26px]">
              <Text className="font-lingua-semibold text-[20px] leading-[28px] text-white">
                Continue learning
              </Text>
              <Text className="mt-[9px] font-lingua-semibold text-[30px] leading-[38px] text-white">
                {homeData.selectedLanguage.name}
              </Text>
              <Text className="mt-[2px] font-lingua-regular text-[20px] leading-[28px] text-white">
                {proficiencyLabels[homeData.currentUnit?.level ?? 'beginner']} · Unit{' '}
                {homeData.currentUnit?.order ?? 1}
              </Text>
              <View className="mt-[17px] h-[50px] w-[125px] items-center justify-center rounded-[16px] bg-white">
                <Text className="font-lingua-bold text-[20px] leading-[26px] text-[#6747F5]">
                  Continue
                </Text>
              </View>
            </View>

            <View style={styles.mountainBack} />
            <View style={styles.mountainFront} />
            <Image
              source={images.palace}
              style={styles.palace}
              contentFit="contain"
            />
          </View>

          <View className="mt-[31px] flex-row items-center justify-between">
            <Text className="font-lingua-bold text-[21px] leading-[29px] text-[#111633]">
              {"Today's plan"}
            </Text>
            <Text className="font-lingua-bold text-[20px] leading-[28px] text-[#6C4EF5]">
              View all
            </Text>
          </View>

          <View className="mt-[24px] gap-[26px]">
            <PlanRow
              complete
              icon={modeIcons[currentLessonMode]}
              subtitle={homeData.currentLesson?.title ?? 'Start your first lesson'}
              title={modeLabels[currentLessonMode]}
            />
            <PlanRow
              icon="headset"
              subtitle={`Talk about ${homeData.selectedLanguage.name.toLowerCase()} basics`}
              title="AI Conversation"
            />
            <PlanRow
              accentColor="#FF5B66"
              icon="game-controller"
              subtitle={`${homeData.currentLesson?.vocabulary.length ?? 0} words`}
              title="New words"
            />
          </View>

          <View className="mt-[28px] h-[142px] flex-row items-center rounded-[22px] bg-[#F4FBEF] pl-[24px] pr-[18px]">
            <View className="flex-1">
              <Text className="font-lingua-medium text-[16px] leading-[23px] text-[#66708E]">
                Next up
              </Text>
              <Text className="mt-[5px] font-lingua-bold text-[23px] leading-[31px] text-[#111633]">
                AI Video Call
              </Text>
              <Text className="mt-[2px] font-lingua-semibold text-[16px] leading-[23px] text-[#66708E]">
                {nextUpLesson?.title ?? 'Practice speaking'}
              </Text>
            </View>

            <View className="flex-row items-center gap-[17px]">
              <Image
                source={images.aiTeacherPortrait}
                style={styles.teacherPortrait}
                contentFit="cover"
              />
              <View className="h-[56px] w-[56px] items-center justify-center rounded-[28px] bg-[#4DCB10]">
                <Ionicons name="videocam" size={32} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <Text className="mt-[16px] text-center font-lingua-medium text-[12px] leading-[18px] text-[#A0A7BA]">
            {unitProgress}% through {homeData.currentUnit?.title ?? homeData.selectedLanguage.name}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type PlanRowProps = {
  accentColor?: string;
  complete?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  subtitle: string;
  title: string;
};

function PlanRow({ accentColor = '#6C4EF5', complete = false, icon, subtitle, title }: PlanRowProps) {
  return (
    <View className="min-h-[62px] flex-row items-center">
      <View
        className="h-[54px] w-[54px] items-center justify-center rounded-[12px]"
        style={{ backgroundColor: accentColor }}>
        <Ionicons name={icon} size={30} color="#FFFFFF" />
      </View>

      <View className="ml-[24px] flex-1">
        <Text className="font-lingua-bold text-[18px] leading-[25px] text-[#1A1F3D]">{title}</Text>
        <Text className="mt-[2px] font-lingua-medium text-[16px] leading-[23px] text-[#7C849F]">
          {subtitle}
        </Text>
      </View>

      <View
        className={`h-[30px] w-[30px] items-center justify-center rounded-[15px] border-2 ${
          complete ? 'border-[#6C4EF5] bg-[#6C4EF5]' : 'border-[#8992AD]'
        }`}>
        {complete ? <Ionicons name="checkmark" size={22} color="#FFFFFF" /> : null}
      </View>
    </View>
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
  headerFlag: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  streakFire: {
    height: 34,
    width: 34,
  },
  dynamicGoalProgress: {
    backgroundColor: '#FF7A16',
    borderRadius: 5,
    height: 9,
  },
  treasure: {
    height: 118,
    width: 118,
  },
  mountainBack: {
    backgroundColor: '#7657FB',
    borderRadius: 120,
    bottom: -34,
    height: 168,
    position: 'absolute',
    right: -35,
    transform: [{ rotate: '45deg' }],
    width: 168,
  },
  mountainFront: {
    backgroundColor: '#4F3FCD',
    borderRadius: 88,
    bottom: -61,
    height: 135,
    left: 171,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 135,
  },
  palace: {
    bottom: -5,
    height: 193,
    position: 'absolute',
    right: -5,
    width: 193,
  },
  teacherPortrait: {
    borderRadius: 46,
    height: 92,
    width: 92,
  },
});
