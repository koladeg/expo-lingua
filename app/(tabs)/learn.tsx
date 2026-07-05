import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <View className="flex-1 items-center justify-center px-8 pb-[120px]">
        <Text className="font-lingua-bold text-[28px] leading-[36px] text-[#050A22]">Learn</Text>
        <Text className="mt-2 text-center font-lingua-regular text-[16px] leading-[24px] text-[#737B96]">
          Learn screen placeholder
        </Text>
      </View>
    </SafeAreaView>
  );
}
