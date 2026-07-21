import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ControlButtonProps = {
  active: boolean;
  background: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tint: string;
};

export function ControlButton({ active, background, icon, label, onPress, tint }: ControlButtonProps) {
  return (
    <View className="items-center gap-[8px]">
      <Pressable
        accessibilityLabel={label}
        accessibilityState={{ selected: active }}
        className="h-[56px] w-[56px] items-center justify-center rounded-full"
        style={[styles.controlShadow, { backgroundColor: background }]}
        onPress={onPress}>
        <Ionicons name={icon} size={24} color={tint} />
      </Pressable>
      <Text className="font-lingua-semibold text-[13px] leading-[18px] text-[#061032]">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  controlShadow: {
    boxShadow: '0 4px 12px rgba(13, 19, 43, 0.08)',
  },
});
