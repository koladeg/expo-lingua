import type { Lesson } from '@/types/learning';

export const lessons = [
  {
    id: 'spanish-greetings',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Say hello',
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
        'You are a cheerful Spanish teacher helping a first-day beginner.',
      lessonBrief:
        'Teach the learner to hear, repeat, and understand basic Spanish greetings.',
      teachingSteps: [
        'Greet the learner with "Hola" and explain that it means hello.',
        'Model "Buenos dias" slowly, then ask the learner to repeat it.',
        'Ask one quick check question using only the words from this lesson.',
      ],
      correctionStyle:
        'Correct gently, repeat the right pronunciation slowly, and celebrate small wins.',
    },
  },
  {
    id: 'spanish-introductions',
    languageId: 'spanish',
    unitId: 'spanish-basics-1',
    title: 'Introduce yourself',
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
        'You are a patient Spanish conversation coach for a beginner learner.',
      lessonBrief:
        'Help the learner practice a very short name exchange with confidence.',
      teachingSteps: [
        'Say "Me llamo..." and explain that it introduces your name.',
        'Invite the learner to repeat the sentence with their own name.',
        'Role-play a two-line introduction using only familiar words.',
      ],
      correctionStyle:
        'Keep corrections short, focus on one pronunciation point, and invite another try.',
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
        'You are a warm French teacher who speaks slowly for new learners.',
      lessonBrief:
        'Teach basic French greetings with clear audio-first pronunciation practice.',
      teachingSteps: [
        'Introduce "Bonjour" and "Merci" with simple examples.',
        'Model "Comment ca va?" and pause for the learner to repeat.',
        'Ask the learner to choose the right English meaning for one word.',
      ],
      correctionStyle:
        'Use friendly encouragement, then replay the phrase at a slower pace.',
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
        'You are a friendly Yoruba teacher introducing greetings to a new learner.',
      lessonBrief:
        'Help the learner hear and repeat short Yoruba greetings clearly.',
      teachingSteps: [
        'Say "Bawo ni" slowly and explain when to use it.',
        'Ask the learner to repeat the phrase twice.',
        'Teach "Mo wa daradara" as a simple answer.',
      ],
      correctionStyle:
        'Encourage the learner, repeat the sound they missed, and keep the pace relaxed.',
    },
  },
] satisfies Lesson[];
