import type { ImageProps } from 'expo-image';

import earth from '@/assets/images/earth.png';
import mascotAuth from '@/assets/images/mascot-auth.png';
import mascotLogo from '@/assets/images/moscot-logo.png';
import mascotWelcome from '@/assets/images/mascot-welcome.png';
import palace from '@/assets/images/palace.png';
import streakFire from '@/assets/images/streak-fire.png';
import treasure from '@/assets/images/treasure.png';
import type { LessonId } from '@/types/learning';

const cafeIllustration = {
  uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85',
};

const travelIllustration = {
  uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
};

const shoppingIllustration = {
  uri: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=85',
};

const familyIllustration = {
  uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85',
};

const aiTeacherStudioBackdrop = {
  uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85',
};

export const images = {
  aiTeacherPortrait: {
    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  },
  aiTeacherStudioBackdrop,
  earth,
  mascotAuth,
  mascotLogo,
  mascotWelcome,
  palace,
  streakFire,
  treasure,
};

export const lessonImages: Record<LessonId, ImageProps['source']> = {
  'spanish-greetings': mascotWelcome,
  'spanish-introductions': earth,
  'spanish-cafe': cafeIllustration,
  'spanish-travel-directions': travelIllustration,
  'spanish-shopping': shoppingIllustration,
  'spanish-family-friends': familyIllustration,
  'french-greetings': mascotWelcome,
  'french-daily-life': earth,
  'french-cafe': cafeIllustration,
  'french-travel-directions': travelIllustration,
  'french-shopping': shoppingIllustration,
  'french-family-friends': familyIllustration,
  'yoruba-greetings': mascotWelcome,
  'yoruba-daily-life': earth,
  'yoruba-cafe': cafeIllustration,
  'yoruba-travel-directions': travelIllustration,
  'yoruba-shopping': shoppingIllustration,
  'yoruba-family-friends': familyIllustration,
};
