import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabRouteName = 'index' | 'learn' | 'ai-teacher' | 'chat' | 'profile';

type TabItem = {
  label: string;
  routeName: TabRouteName;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

const tabs: TabItem[] = [
  {
    label: 'Home',
    routeName: 'index',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    label: 'Learn',
    routeName: 'learn',
    icon: 'book-outline',
    activeIcon: 'book',
  },
  {
    label: 'AI Teacher',
    routeName: 'ai-teacher',
    icon: 'sparkles-outline',
    activeIcon: 'sparkles',
  },
  {
    label: 'Chat',
    routeName: 'chat',
    icon: 'chatbubble-outline',
    activeIcon: 'chatbubble',
  },
  {
    label: 'Profile',
    routeName: 'profile',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

const ACTIVE_COLOR = '#6C4EF5';
const INACTIVE_COLOR = '#7B849E';
const TAB_BAR_HORIZONTAL_PADDING = 18;
const ACTIVE_CIRCLE_SIZE = 52;

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  const visibleRoutes = state.routes.filter((route) =>
    tabs.some((tab) => tab.routeName === route.name),
  );
  const activeRoute = state.routes[state.index];
  const activeTabIndex = tabs.findIndex((tab) => tab.routeName === activeRoute?.name);
  const activeTab = activeTabIndex >= 0 ? tabs[activeTabIndex] : tabs[0];
  const tabWidth = barWidth > 0 ? (barWidth - TAB_BAR_HORIZONTAL_PADDING * 2) / tabs.length : 0;

  useEffect(() => {
    if (tabWidth <= 0 || activeTabIndex < 0) {
      return;
    }

    Animated.spring(translateX, {
      damping: 20,
      mass: 0.9,
      stiffness: 190,
      toValue:
        TAB_BAR_HORIZONTAL_PADDING +
        tabWidth * activeTabIndex +
        (tabWidth - ACTIVE_CIRCLE_SIZE) / 2,
      useNativeDriver: true,
    }).start();
  }, [activeTabIndex, tabWidth, translateX]);

  if (activeTabIndex < 0) {
    return null;
  }

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white px-[14px] pb-[10px] pt-[6px]"
      pointerEvents="box-none">
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}>
        {tabWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeCircle,
              {
                transform: [{ translateX }],
              },
            ]}>
            <Ionicons name={activeTab.activeIcon} size={29} color="#FFFFFF" />
          </Animated.View>
        ) : null}

        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            const route = visibleRoutes.find((visibleRoute) => visibleRoute.name === tab.routeName);

            if (!route) {
              return null;
            }

            const isFocused = activeRoute?.key === route.key;
            const options = descriptors[route.key]?.options;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel={options?.tabBarAccessibilityLabel ?? tab.label}
                accessibilityState={isFocused ? { selected: true } : {}}
                style={styles.tabButton}
                onPress={onPress}>
                {isFocused ? (
                  <View style={styles.activeCircleSpacer} />
                ) : (
                  <>
                    <Ionicons name={tab.icon} size={29} color={INACTIVE_COLOR} />
                    <Text className="font-lingua-semibold text-[13px] leading-[18px] text-[#7B849E]">
                      {tab.label}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F1F7',
    borderRadius: 28,
    borderWidth: 1,
    boxShadow: '0 -4px 20px rgba(18, 24, 38, 0.08)',
    minHeight: 98,
    paddingHorizontal: TAB_BAR_HORIZONTAL_PADDING,
    paddingTop: 10,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    height: 66,
    justifyContent: 'center',
  },
  activeCircle: {
    alignItems: 'center',
    backgroundColor: ACTIVE_COLOR,
    borderRadius: ACTIVE_CIRCLE_SIZE / 2,
    height: ACTIVE_CIRCLE_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    width: ACTIVE_CIRCLE_SIZE,
    zIndex: 2,
  },
  activeCircleSpacer: {
    height: ACTIVE_CIRCLE_SIZE,
    width: ACTIVE_CIRCLE_SIZE,
  },
});
