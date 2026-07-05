import { useAuth, useUser } from '@clerk/expo';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const firstName = user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? 'learner';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View className="gap-2">
          <Text className="font-lingua-bold text-[32px] leading-[40px] text-lingua-text-primary">
            Welcome back,
          </Text>
          <Text className="font-lingua-bold text-[32px] leading-[40px] text-lingua-deep-purple">
            {firstName}
          </Text>
          <Text className="mt-2 font-lingua-regular text-[18px] leading-[28px] text-[#596176]">
            Your first AI language lesson will live here next.
          </Text>
        </View>

        <View className="mt-10 gap-4">
          <View className="rounded-[24px] bg-[#F5F4FF] p-5">
            <Text className="font-lingua-semibold text-[20px] leading-[28px] text-lingua-text-primary">
              Today&apos;s lesson
            </Text>
            <Text className="mt-2 font-lingua-regular text-[16px] leading-[24px] text-[#596176]">
              Start with greetings, listening practice, and a short tutor chat.
            </Text>
          </View>

          <Link href="/language-selection" asChild>
            <Pressable style={styles.languageButton}>
              <View className="flex-1">
                <Text className="font-lingua-semibold text-[18px] leading-[25px] text-lingua-text-primary">
                  Choose your language
                </Text>
                <Text className="mt-1 font-lingua-regular text-[14px] leading-[21px] text-[#596176]">
                  Pick the course you want to start with.
                </Text>
              </View>
              <Text className="font-lingua-bold text-[30px] leading-[34px] text-lingua-deep-purple">
                ›
              </Text>
            </Pressable>
          </Link>

          <View className="flex-row gap-4">
            <View className="flex-1 rounded-[20px] bg-[#EEF8FF] p-4">
              <Text className="font-lingua-bold text-[28px] leading-[34px] text-[#0A84FF]">
                0
              </Text>
              <Text className="mt-1 font-lingua-medium text-[15px] leading-[22px] text-[#596176]">
                XP
              </Text>
            </View>

            <View className="flex-1 rounded-[20px] bg-[#FFF4EE] p-4">
              <Text className="font-lingua-bold text-[28px] leading-[34px] text-[#FF8A00]">
                0
              </Text>
              <Text className="mt-1 font-lingua-medium text-[15px] leading-[22px] text-[#596176]">
                Day streak
              </Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.signOutButton} onPress={() => void signOut()}>
          <Text className="font-lingua-semibold text-[16px] leading-[22px] text-lingua-deep-purple">
            Sign out
          </Text>
        </Pressable>
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
    paddingBottom: 32,
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  signOutButton: {
    alignItems: 'center',
    borderColor: '#E8EAF1',
    borderRadius: 18,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    marginTop: 'auto',
  },
  languageButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EAF1',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 78,
    paddingHorizontal: 18,
  },
});
