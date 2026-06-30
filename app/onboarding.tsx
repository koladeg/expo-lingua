import { images } from '@/constants/images';
import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const signUpHref = '/sign-up' as Href;

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}>
        <View className="min-h-full px-[38px] pt-3">
          <View className="items-center">
            <View className="flex-row items-center gap-3">
              <Image
                source={images.mascotLogo}
                style={styles.logo}
                contentFit="contain"
              />
              <Text className="font-lingua-bold text-[36px] leading-[44px] text-lingua-text-primary">
                kola_lingo
              </Text>
            </View>
          </View>

          <View className="mt-[42px]">
            <Text className="font-lingua-bold text-[37px] leading-[48px] text-lingua-text-primary">
              Your AI language
            </Text>
            <Text className="font-lingua-bold text-[37px] leading-[48px] text-lingua-deep-purple">
              teacher.
            </Text>
            <Text className="mt-[14px] font-lingua-regular text-[20px] leading-[34px] text-[#596176]">
              Real conversations, personalized{'\n'}lessons, anytime, anywhere.
            </Text>
          </View>

          <View className="relative mt-[18px] h-[340px]">
            <View className="absolute left-[3px] top-[15px] rounded-[16px] bg-[#EEF8FF] px-[22px] py-[13px]">
              <Text className="font-lingua-regular text-[25px] leading-[31px] text-[#090E22]">
                Hello!
              </Text>
              <View className="absolute bottom-[-12px] right-[19px] h-0 w-0 border-l-[14px] border-r-[0px] border-t-[14px] border-l-transparent border-t-[#EEF8FF]" />
            </View>

            <View className="absolute right-[12px] top-[0px] rotate-[10deg] rounded-[16px] bg-[#F5F4FF] px-[22px] py-[13px]">
              <Text className="font-lingua-regular italic text-[25px] leading-[31px] text-lingua-deep-purple">
                ¡Hola!
              </Text>
              <View className="absolute bottom-[-12px] left-[26px] h-0 w-0 border-r-[14px] border-t-[14px] border-r-transparent border-t-[#F5F4FF]" />
            </View>

            <View className="absolute right-[-3px] top-[112px] rounded-[16px] bg-[#FFF4EE] px-[22px] py-[13px]">
              <Text className="font-lingua-regular text-[25px] leading-[31px] text-[#FF3E32]">
                你好!
              </Text>
              <View className="absolute bottom-[-12px] left-[24px] h-0 w-0 border-r-[14px] border-t-[14px] border-r-transparent border-t-[#FFF4EE]" />
            </View>

            <Image
              source={images.mascotWelcome}
              style={styles.mascot}
              contentFit="contain"
            />
          </View>

          <View className="mt-auto pt-4">
            <Link href={signUpHref} asChild>
              <Pressable style={styles.button}>
                <Text className="font-lingua-semibold text-[24px] leading-[30px] text-white">
                  Get Started
                </Text>
                <Text className="absolute right-[34px] font-lingua-regular text-[48px] leading-[54px] text-white">
                  ›
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 52,
    width: 52,
  },
  mascot: {
    bottom: -4,
    height: 345,
    left: -17,
    position: 'absolute',
    width: 345,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#5B3BF6',
    borderRadius: 24,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
});
