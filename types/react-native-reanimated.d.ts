declare module 'react-native-reanimated' {
  import type { RefObject } from 'react';
  import { ScrollView, Text, View } from 'react-native';

  const Animated: {
    ScrollView: typeof ScrollView;
    Text: typeof Text;
    View: typeof View;
  };

  namespace Animated {
    type ScrollView = InstanceType<typeof import('react-native').ScrollView>;
  }

  export function interpolate(
    value: number,
    inputRange: number[],
    outputRange: number[],
  ): number;

  export function useAnimatedRef<T>(): RefObject<T | null>;

  export function useAnimatedStyle<TStyle extends object>(updater: () => TStyle): TStyle;

  export function useScrollOffset(ref: RefObject<unknown>): { value: number };

  export default Animated;
}
