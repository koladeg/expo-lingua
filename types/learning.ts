export type ProficiencyLevel = 'beginner' | 'elementary' | 'intermediate';

export type LessonMode = 'audio' | 'chat' | 'video' | 'review';

export type ActivityType =
  | 'listen-and-repeat'
  | 'choose-translation'
  | 'match-pairs'
  | 'speak'
  | 'chat-reply';

export type LanguageId = 'spanish' | 'french' | 'yoruba';

export type UnitId = `${LanguageId}-basics-${number}`;

export type LessonId = `${LanguageId}-${string}`;

export type PhraseId = `${LanguageId}-phrase-${string}`;

export type LearningLanguage = {
  id: LanguageId;
  name: string;
  nativeName: string;
  shortName: string;
  flag: {
    countryCode: string;
    imageUrl: string;
    alt: string;
  };
  accentColor: string;
  description: string;
  isRightToLeft: boolean;
};

export type LearningUnit = {
  id: UnitId;
  languageId: LanguageId;
  title: string;
  description: string;
  level: ProficiencyLevel;
  order: number;
  lessonIds: LessonId[];
};

export type LessonGoal = {
  id: string;
  text: string;
};

export type VocabularyItem = {
  id: string;
  term: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'interjection';
};

export type Phrase = {
  id: PhraseId;
  text: string;
  translation: string;
  pronunciation: string;
  usageNote: string;
};

export type BaseActivity = {
  id: string;
  type: ActivityType;
  prompt: string;
};

export type ListenAndRepeatActivity = BaseActivity & {
  type: 'listen-and-repeat';
  phraseId: PhraseId;
};

export type ChooseTranslationActivity = BaseActivity & {
  type: 'choose-translation';
  correctAnswer: string;
  options: string[];
};

export type MatchPairsActivity = BaseActivity & {
  type: 'match-pairs';
  pairs: {
    term: string;
    translation: string;
  }[];
};

export type SpeakActivity = BaseActivity & {
  type: 'speak';
  phraseId: PhraseId;
  expectedText: string;
};

export type ChatReplyActivity = BaseActivity & {
  type: 'chat-reply';
  tutorMessage: string;
  suggestedReplies: string[];
};

export type LessonActivity =
  | ListenAndRepeatActivity
  | ChooseTranslationActivity
  | MatchPairsActivity
  | SpeakActivity
  | ChatReplyActivity;

export type AITeacherPrompt = {
  persona: string;
  lessonBrief: string;
  teachingSteps: string[];
  correctionStyle: string;
};

export type Lesson = {
  id: LessonId;
  languageId: LanguageId;
  unitId: UnitId;
  title: string;
  description: string;
  level: ProficiencyLevel;
  mode: LessonMode;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: LessonActivity[];
  aiTeacherPrompt: AITeacherPrompt;
};
