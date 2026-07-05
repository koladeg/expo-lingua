import type { LearningLanguage } from '@/types/learning';

export const languages = [
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Espanol',
    shortName: 'ES',
    flag: {
      countryCode: 'es',
      imageUrl: 'https://flagcdn.com/w80/es.png',
      alt: 'Flag of Spain',
    },
    accentColor: '#58CC02',
    description: 'Start with friendly greetings and everyday travel phrases.',
    isRightToLeft: false,
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Francais',
    shortName: 'FR',
    flag: {
      countryCode: 'fr',
      imageUrl: 'https://flagcdn.com/w80/fr.png',
      alt: 'Flag of France',
    },
    accentColor: '#1CB0F6',
    description: 'Practice simple introductions with clear pronunciation.',
    isRightToLeft: false,
  },
  {
    id: 'yoruba',
    name: 'Yoruba',
    nativeName: 'Yoruba',
    shortName: 'YO',
    flag: {
      countryCode: 'ng',
      imageUrl: 'https://flagcdn.com/w80/ng.png',
      alt: 'Flag of Nigeria',
    },
    accentColor: '#CE82FF',
    description: 'Learn warm greetings used in everyday conversation.',
    isRightToLeft: false,
  },
] satisfies LearningLanguage[];

export const defaultLanguageId = languages[0].id;
