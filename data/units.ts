import type { LearningUnit } from '@/types/learning';

export const units = [
  {
    id: 'spanish-basics-1',
    languageId: 'spanish',
    title: 'Spanish Basics 1',
    description: 'Say hello, introduce yourself, and recognize common words.',
    level: 'beginner',
    order: 1,
    lessonIds: ['spanish-greetings', 'spanish-introductions'],
  },
  {
    id: 'french-basics-1',
    languageId: 'french',
    title: 'French Basics 1',
    description: 'Build confidence with greetings and polite replies.',
    level: 'beginner',
    order: 1,
    lessonIds: ['french-greetings'],
  },
  {
    id: 'yoruba-basics-1',
    languageId: 'yoruba',
    title: 'Yoruba Basics 1',
    description: 'Practice short greetings for family and friends.',
    level: 'beginner',
    order: 1,
    lessonIds: ['yoruba-greetings'],
  },
] satisfies LearningUnit[];
