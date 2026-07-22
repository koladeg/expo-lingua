import type { Lesson } from '@/types/learning';

type PracticeLessonInput = {
  languageId: Lesson['languageId'];
  unitId: Lesson['unitId'];
  id: Lesson['id'];
  title: string;
  description: string;
  order: number;
  mode: Lesson['mode'];
  topicTerm: string;
  topicTranslation: string;
  phrase: string;
  phraseTranslation: string;
  pronunciation: string;
};

function createPracticeLesson({
  description,
  id,
  languageId,
  mode,
  order,
  phrase,
  phraseTranslation,
  pronunciation,
  title,
  topicTerm,
  topicTranslation,
  unitId,
}: PracticeLessonInput): Lesson {
  const phraseId = `${languageId}-phrase-${id.replace(`${languageId}-`, '')}` as Lesson['phrases'][number]['id'];

  return {
    id,
    languageId,
    unitId,
    title,
    description,
    level: 'beginner',
    mode,
    order,
    xpReward: 10,
    estimatedMinutes: mode === 'video' ? 8 : 6,
    goals: [
      {
        id: `${id}-goal-1`,
        text: `Recognize useful words for ${title.toLowerCase()}.`,
      },
      {
        id: `${id}-goal-2`,
        text: `Practice one short ${languageId} phrase with confidence.`,
      },
    ],
    vocabulary: [
      {
        id: `${id}-vocab-1`,
        term: topicTerm,
        translation: topicTranslation,
        pronunciation,
        partOfSpeech: 'phrase',
      },
      {
        id: `${id}-vocab-2`,
        term: phrase,
        translation: phraseTranslation,
        pronunciation,
        partOfSpeech: 'phrase',
      },
    ],
    phrases: [
      {
        id: phraseId,
        text: phrase,
        translation: phraseTranslation,
        pronunciation,
        usageNote: `Use this during beginner ${title.toLowerCase()} practice.`,
      },
    ],
    activities: [
      {
        id: `${id}-activity-1`,
        type: 'listen-and-repeat',
        prompt: 'Listen and repeat the phrase.',
        phraseId,
      },
      {
        id: `${id}-activity-2`,
        type: 'choose-translation',
        prompt: `What does "${topicTerm}" mean?`,
        correctAnswer: topicTranslation,
        options: [topicTranslation, 'Goodbye', 'Thank you'],
      },
    ],
    aiTeacherPrompt: {
      persona: `You're a warm, energetic ${languageId} teacher working one-on-one with a beginner — talk like a real person, not a script.`,
      lessonBrief: `Stay strictly inside this lesson: simple words and one useful phrase for ${title.toLowerCase()}. Don't teach anything outside this lesson's vocabulary.`,
      teachingSteps: [
        `Introduce "${topicTerm}" slowly, give its English meaning right away, and ask the learner to say it back.`,
        `Model "${phrase}" slowly with its translation, then ask the learner to try it themselves.`,
        "Listen to how they did — if they've got it, celebrate with real enthusiasm and ask one quick check question using only this lesson's words; if not, slow down and have them try again.",
      ],
      correctionStyle:
        "Correct gently in one short, natural sentence, repeat the right sound slowly, and celebrate small wins like you mean it.",
    },
  };
}

export const lessons = [
  {
    id: 'spanish-greetings',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Greetings & Introductions',
    description: 'Learn simple Spanish greetings for meeting someone new.',
    level: 'beginner',
    mode: 'audio',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      {
        id: 'spanish-greetings-goal-1',
        text: 'Recognize common hello and goodbye words.',
      },
      {
        id: 'spanish-greetings-goal-2',
        text: 'Say one short greeting out loud.',
      },
    ],
    vocabulary: [
      {
        id: 'spanish-hola',
        term: 'Hola',
        translation: 'Hello',
        pronunciation: 'OH-lah',
        partOfSpeech: 'interjection',
      },
      {
        id: 'spanish-adios',
        term: 'Adios',
        translation: 'Goodbye',
        pronunciation: 'ah-DYOS',
        partOfSpeech: 'interjection',
      },
      {
        id: 'spanish-gracias',
        term: 'Gracias',
        translation: 'Thank you',
        pronunciation: 'GRAH-syahs',
        partOfSpeech: 'interjection',
      },
    ],
    phrases: [
      {
        id: 'spanish-phrase-buenos-dias',
        text: 'Buenos dias',
        translation: 'Good morning',
        pronunciation: 'BWEH-nos DEE-ahs',
        usageNote: 'Use this in the morning when greeting someone.',
      },
      {
        id: 'spanish-phrase-como-estas',
        text: 'Como estas?',
        translation: 'How are you?',
        pronunciation: 'KOH-moh ehs-TAHS',
        usageNote: 'A friendly question for someone you already know.',
      },
    ],
    activities: [
      {
        id: 'spanish-greetings-activity-1',
        type: 'listen-and-repeat',
        prompt: 'Listen and repeat the greeting.',
        phraseId: 'spanish-phrase-buenos-dias',
      },
      {
        id: 'spanish-greetings-activity-2',
        type: 'choose-translation',
        prompt: 'What does "Hola" mean?',
        correctAnswer: 'Hello',
        options: ['Hello', 'Goodbye', 'Please'],
      },
      {
        id: 'spanish-greetings-activity-3',
        type: 'match-pairs',
        prompt: 'Match each Spanish word to English.',
        pairs: [
          {
            term: 'Hola',
            translation: 'Hello',
          },
          {
            term: 'Gracias',
            translation: 'Thank you',
          },
        ],
      },
    ],
    aiTeacherPrompt: {
      persona:
        "You're a cheerful, energetic Spanish teacher making a first-day beginner feel instantly welcome.",
      lessonBrief:
        "Stay strictly inside this lesson — help the learner hear, repeat, and understand basic Spanish greetings, nothing more.",
      teachingSteps: [
        'Greet the learner with "Hola," slowly, and tell them it means hello.',
        'Model "Buenos dias" slowly with its translation, then ask the learner to repeat it.',
        "Listen to their attempt — if they've got it, celebrate with real warmth and ask one quick check question using only this lesson's words; if not, slow down and try again together.",
      ],
      correctionStyle:
        "Correct gently in one short, natural sentence, repeat the right pronunciation slowly, and celebrate small wins like you mean it.",
    },
  },
  {
    id: 'spanish-introductions',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Daily Life',
    description: 'Practice saying your name and asking for someone else\'s name.',
    level: 'beginner',
    mode: 'chat',
    order: 2,
    xpReward: 10,
    estimatedMinutes: 6,
    goals: [
      {
        id: 'spanish-introductions-goal-1',
        text: 'Say "My name is..." in Spanish.',
      },
      {
        id: 'spanish-introductions-goal-2',
        text: 'Ask someone for their name.',
      },
    ],
    vocabulary: [
      {
        id: 'spanish-me',
        term: 'Me',
        translation: 'Myself / me',
        pronunciation: 'meh',
        partOfSpeech: 'phrase',
      },
      {
        id: 'spanish-llamo',
        term: 'llamo',
        translation: 'I am called',
        pronunciation: 'YAH-moh',
        partOfSpeech: 'verb',
      },
    ],
    phrases: [
      {
        id: 'spanish-phrase-me-llamo',
        text: 'Me llamo Ana',
        translation: 'My name is Ana',
        pronunciation: 'meh YAH-moh AH-nah',
        usageNote: 'Replace Ana with your own name.',
      },
      {
        id: 'spanish-phrase-como-te-llamas',
        text: 'Como te llamas?',
        translation: 'What is your name?',
        pronunciation: 'KOH-moh teh YAH-mahs',
        usageNote: 'Use this to ask a peer for their name.',
      },
    ],
    activities: [
      {
        id: 'spanish-introductions-activity-1',
        type: 'chat-reply',
        prompt: 'Reply to your tutor in Spanish.',
        tutorMessage: 'Hola! Como te llamas?',
        suggestedReplies: ['Me llamo Ana', 'Buenos dias', 'Gracias'],
      },
      {
        id: 'spanish-introductions-activity-2',
        type: 'speak',
        prompt: 'Say: Me llamo Ana.',
        phraseId: 'spanish-phrase-me-llamo',
        expectedText: 'Me llamo Ana',
      },
    ],
    aiTeacherPrompt: {
      persona:
        "You're a warm, upbeat Spanish conversation coach helping a beginner build confidence.",
      lessonBrief:
        "Stay strictly inside this lesson — help the learner practice a very short name exchange, nothing beyond that.",
      teachingSteps: [
        'Say "Me llamo..." slowly, translate it, and explain that it introduces your name.',
        'Invite the learner to repeat the sentence with their own name.',
        "Listen to their attempt and role-play a two-line introduction using only familiar words — react with real enthusiasm if they've got it, or slow down and ask them to try again if not.",
      ],
      correctionStyle:
        "Keep corrections short and natural, focus on one pronunciation point, and invite another try with warmth.",
    },
  },
  {
    id: 'french-greetings',
    languageId: 'french',
    unitId: 'french-basics-1',
    title: 'Friendly greetings',
    description: 'Use simple French greetings and polite words.',
    level: 'beginner',
    mode: 'audio',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      {
        id: 'french-greetings-goal-1',
        text: 'Recognize hello, goodbye, and thank you.',
      },
      {
        id: 'french-greetings-goal-2',
        text: 'Repeat a polite French greeting.',
      },
    ],
    vocabulary: [
      {
        id: 'french-bonjour',
        term: 'Bonjour',
        translation: 'Hello',
        pronunciation: 'bohn-ZHOOR',
        partOfSpeech: 'interjection',
      },
      {
        id: 'french-merci',
        term: 'Merci',
        translation: 'Thank you',
        pronunciation: 'mehr-SEE',
        partOfSpeech: 'interjection',
      },
      {
        id: 'french-au-revoir',
        term: 'Au revoir',
        translation: 'Goodbye',
        pronunciation: 'oh ruh-VWAHR',
        partOfSpeech: 'interjection',
      },
    ],
    phrases: [
      {
        id: 'french-phrase-comment-ca-va',
        text: 'Comment ca va?',
        translation: 'How are you?',
        pronunciation: 'koh-MAHN sah vah',
        usageNote: 'A common friendly check-in.',
      },
      {
        id: 'french-phrase-ca-va-bien',
        text: 'Ca va bien',
        translation: 'I am doing well',
        pronunciation: 'sah vah byan',
        usageNote: 'A simple positive answer.',
      },
    ],
    activities: [
      {
        id: 'french-greetings-activity-1',
        type: 'choose-translation',
        prompt: 'What does "Merci" mean?',
        correctAnswer: 'Thank you',
        options: ['Thank you', 'Hello', 'Good night'],
      },
      {
        id: 'french-greetings-activity-2',
        type: 'listen-and-repeat',
        prompt: 'Listen and repeat the phrase.',
        phraseId: 'french-phrase-comment-ca-va',
      },
    ],
    aiTeacherPrompt: {
      persona:
        "You're a warm, energetic French teacher who speaks slowly and clearly for new learners.",
      lessonBrief:
        "Stay strictly inside this lesson — teach only these basic French greetings with clear, audio-first pronunciation practice.",
      teachingSteps: [
        'Introduce "Bonjour" and "Merci" slowly, with simple examples and their translations.',
        'Model "Comment ca va?" and pause for the learner to repeat it.',
        "Listen to their attempt — if they've got it, celebrate and ask them to choose the right English meaning for one word; if not, slow down and try again together.",
      ],
      correctionStyle:
        "Use friendly, natural encouragement, then replay the phrase at a slower pace.",
    },
  },
  {
    id: 'yoruba-greetings',
    languageId: 'yoruba',
    unitId: 'yoruba-basics-1',
    title: 'Everyday greetings',
    description: 'Learn short Yoruba greetings for simple conversations.',
    level: 'beginner',
    mode: 'audio',
    order: 1,
    xpReward: 10,
    estimatedMinutes: 5,
    goals: [
      {
        id: 'yoruba-greetings-goal-1',
        text: 'Say hello in Yoruba.',
      },
      {
        id: 'yoruba-greetings-goal-2',
        text: 'Ask someone how they are.',
      },
    ],
    vocabulary: [
      {
        id: 'yoruba-bawo',
        term: 'Bawo',
        translation: 'How',
        pronunciation: 'BAH-woh',
        partOfSpeech: 'phrase',
      },
      {
        id: 'yoruba-ni',
        term: 'ni',
        translation: 'is / are',
        pronunciation: 'nee',
        partOfSpeech: 'verb',
      },
      {
        id: 'yoruba-o-se',
        term: 'O se',
        translation: 'Thank you',
        pronunciation: 'oh sheh',
        partOfSpeech: 'interjection',
      },
    ],
    phrases: [
      {
        id: 'yoruba-phrase-bawo-ni',
        text: 'Bawo ni',
        translation: 'Hello / How are you?',
        pronunciation: 'BAH-woh nee',
        usageNote: 'A simple greeting for many everyday situations.',
      },
      {
        id: 'yoruba-phrase-mo-wa-dadara',
        text: 'Mo wa daradara',
        translation: 'I am fine',
        pronunciation: 'moh wah dah-dah-rah',
        usageNote: 'Use this as a friendly response.',
      },
    ],
    activities: [
      {
        id: 'yoruba-greetings-activity-1',
        type: 'listen-and-repeat',
        prompt: 'Listen and repeat the Yoruba greeting.',
        phraseId: 'yoruba-phrase-bawo-ni',
      },
      {
        id: 'yoruba-greetings-activity-2',
        type: 'chat-reply',
        prompt: 'Choose a friendly reply.',
        tutorMessage: 'Bawo ni?',
        suggestedReplies: ['Mo wa daradara', 'Adios', 'Bonjour'],
      },
    ],
    aiTeacherPrompt: {
      persona:
        "You're a friendly, energetic Yoruba teacher introducing greetings to a new learner.",
      lessonBrief:
        "Stay strictly inside this lesson — help the learner hear and repeat these short Yoruba greetings clearly, nothing more.",
      teachingSteps: [
        'Say "Bawo ni" slowly, translate it, and explain when to use it.',
        'Ask the learner to repeat the phrase, listening closely to how they do.',
        "Teach \"Mo wa daradara\" as a simple answer — celebrate with real warmth if they've got it, or slow down and try again if not.",
      ],
      correctionStyle:
        "Encourage the learner in a natural, upbeat way, repeat the sound they missed, and keep the pace relaxed.",
    },
  },
  createPracticeLesson({
    id: 'spanish-cafe',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'At the Cafe',
    description: 'Order a drink and use friendly cafe words.',
    order: 3,
    mode: 'video',
    topicTerm: 'Cafe',
    topicTranslation: 'Cafe',
    phrase: 'Un cafe, por favor',
    phraseTranslation: 'A coffee, please',
    pronunciation: 'oon kah-FEH por fah-VOR',
  }),
  createPracticeLesson({
    id: 'spanish-travel-directions',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Travel & Directions',
    description: 'Ask where places are and understand simple directions.',
    order: 4,
    mode: 'chat',
    topicTerm: 'Donde',
    topicTranslation: 'Where',
    phrase: 'Donde esta la estacion?',
    phraseTranslation: 'Where is the station?',
    pronunciation: 'DON-deh ehs-TAH lah ehs-tah-SYON',
  }),
  createPracticeLesson({
    id: 'spanish-shopping',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Shopping',
    description: 'Ask for prices and use polite shopping phrases.',
    order: 5,
    mode: 'audio',
    topicTerm: 'Cuanto',
    topicTranslation: 'How much',
    phrase: 'Cuanto cuesta?',
    phraseTranslation: 'How much does it cost?',
    pronunciation: 'KWAN-toh KWEHS-tah',
  }),
  createPracticeLesson({
    id: 'spanish-family-friends',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Family & Friends',
    description: 'Talk about close people using simple sentences.',
    order: 6,
    mode: 'review',
    topicTerm: 'Familia',
    topicTranslation: 'Family',
    phrase: 'Mi familia es grande',
    phraseTranslation: 'My family is big',
    pronunciation: 'mee fah-MEE-lyah ehs GRAHN-deh',
  }),
  createPracticeLesson({
    id: 'french-daily-life',
    languageId: 'french',
    unitId: 'french-basics-1',
    title: 'Daily Life',
    description: 'Use simple words for everyday routines.',
    order: 2,
    mode: 'chat',
    topicTerm: 'Aujourd hui',
    topicTranslation: 'Today',
    phrase: 'Je vais bien',
    phraseTranslation: 'I am doing well',
    pronunciation: 'zhuh vay byan',
  }),
  createPracticeLesson({
    id: 'french-cafe',
    languageId: 'french',
    unitId: 'french-basics-1',
    title: 'At the Cafe',
    description: 'Order politely and recognize cafe words.',
    order: 3,
    mode: 'video',
    topicTerm: 'Cafe',
    topicTranslation: 'Cafe',
    phrase: 'Un cafe, s il vous plait',
    phraseTranslation: 'A coffee, please',
    pronunciation: 'uhn kah-FAY seel voo play',
  }),
  createPracticeLesson({
    id: 'french-travel-directions',
    languageId: 'french',
    unitId: 'french-basics-1',
    title: 'Travel & Directions',
    description: 'Ask where to go and follow short replies.',
    order: 4,
    mode: 'chat',
    topicTerm: 'Ou',
    topicTranslation: 'Where',
    phrase: 'Ou est la gare?',
    phraseTranslation: 'Where is the station?',
    pronunciation: 'oo eh lah gar',
  }),
  createPracticeLesson({
    id: 'french-shopping',
    languageId: 'french',
    unitId: 'french-basics-1',
    title: 'Shopping',
    description: 'Ask for prices and thank shopkeepers.',
    order: 5,
    mode: 'audio',
    topicTerm: 'Combien',
    topicTranslation: 'How much',
    phrase: 'Combien ca coute?',
    phraseTranslation: 'How much does it cost?',
    pronunciation: 'kohm-BYAN sah koot',
  }),
  createPracticeLesson({
    id: 'french-family-friends',
    languageId: 'french',
    unitId: 'french-basics-1',
    title: 'Family & Friends',
    description: 'Describe people you know with beginner phrases.',
    order: 6,
    mode: 'review',
    topicTerm: 'Famille',
    topicTranslation: 'Family',
    phrase: 'Ma famille est grande',
    phraseTranslation: 'My family is big',
    pronunciation: 'mah fah-MEE eh grahnd',
  }),
  createPracticeLesson({
    id: 'yoruba-daily-life',
    languageId: 'yoruba',
    unitId: 'yoruba-basics-1',
    title: 'Daily Life',
    description: 'Practice short phrases for everyday routines.',
    order: 2,
    mode: 'chat',
    topicTerm: 'Loni',
    topicTranslation: 'Today',
    phrase: 'Mo wa dada',
    phraseTranslation: 'I am fine',
    pronunciation: 'moh wah dah-dah',
  }),
  createPracticeLesson({
    id: 'yoruba-cafe',
    languageId: 'yoruba',
    unitId: 'yoruba-basics-1',
    title: 'At the Cafe',
    description: 'Use friendly words for food and drinks.',
    order: 3,
    mode: 'video',
    topicTerm: 'Kofi',
    topicTranslation: 'Coffee',
    phrase: 'Jowo, mo fe kofi',
    phraseTranslation: 'Please, I want coffee',
    pronunciation: 'jaw-woh moh feh kaw-fee',
  }),
  createPracticeLesson({
    id: 'yoruba-travel-directions',
    languageId: 'yoruba',
    unitId: 'yoruba-basics-1',
    title: 'Travel & Directions',
    description: 'Ask where places are with simple travel phrases.',
    order: 4,
    mode: 'chat',
    topicTerm: 'Nibo',
    topicTranslation: 'Where',
    phrase: 'Nibo ni ibudo wa?',
    phraseTranslation: 'Where is the station?',
    pronunciation: 'nee-boh nee ee-boo-doh wah',
  }),
  createPracticeLesson({
    id: 'yoruba-shopping',
    languageId: 'yoruba',
    unitId: 'yoruba-basics-1',
    title: 'Shopping',
    description: 'Ask for prices and practice market words.',
    order: 5,
    mode: 'audio',
    topicTerm: 'Elo',
    topicTranslation: 'How much',
    phrase: 'Elo ni eyi?',
    phraseTranslation: 'How much is this?',
    pronunciation: 'eh-loh nee eh-yee',
  }),
  createPracticeLesson({
    id: 'yoruba-family-friends',
    languageId: 'yoruba',
    unitId: 'yoruba-basics-1',
    title: 'Family & Friends',
    description: 'Talk about family and friends in short sentences.',
    order: 6,
    mode: 'review',
    topicTerm: 'Ebi',
    topicTranslation: 'Family',
    phrase: 'Ebi mi tobi',
    phraseTranslation: 'My family is big',
    pronunciation: 'eh-bee mee toh-bee',
  }),
] satisfies Lesson[];
