import { useAuth } from '@clerk/expo';
import { Redirect, Tabs, usePathname } from 'expo-router';

import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { useLanguageStore } from '@/store/language-store';

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);

  if (!isLoaded || !hasHydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedLanguageId && pathname !== '/language-selection') {
    return <Redirect href="/language-selection" />;
  }

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
      <Tabs.Screen name="ai-teacher" options={{ title: 'AI Teacher' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen
        name="language-selection"
        options={{
          href: null,
          title: 'Choose a language',
        }}
      />
    </Tabs>
  );
}
