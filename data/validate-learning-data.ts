import { languages } from '@/data/languages';
import { lessons } from '@/data/lessons';
import { units } from '@/data/units';
import type { LessonActivity, LessonId, PhraseId } from '@/types/learning';

export function validateLearningData() {
  const languageIds = new Set(languages.map((language) => language.id));
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const unitIds = new Set(units.map((unit) => unit.id));
  const errors: string[] = [];

  collectDuplicates(
    'language id',
    languages.map((language) => language.id),
    errors,
  );
  collectDuplicates(
    'unit id',
    units.map((unit) => unit.id),
    errors,
  );
  collectDuplicates(
    'lesson id',
    lessons.map((lesson) => lesson.id),
    errors,
  );

  for (const unit of units) {
    if (!languageIds.has(unit.languageId)) {
      errors.push(`Unit "${unit.id}" references missing language "${unit.languageId}".`);
    }

    for (const lessonId of unit.lessonIds) {
      if (!lessonIds.has(lessonId)) {
        errors.push(`Unit "${unit.id}" references missing lesson "${lessonId}".`);
      }
    }
  }

  for (const lesson of lessons) {
    if (!languageIds.has(lesson.languageId)) {
      errors.push(`Lesson "${lesson.id}" references missing language "${lesson.languageId}".`);
    }

    if (!unitIds.has(lesson.unitId)) {
      errors.push(`Lesson "${lesson.id}" references missing unit "${lesson.unitId}".`);
    }

    const unit = units.find((currentUnit) => currentUnit.id === lesson.unitId);

    if (unit && unit.languageId !== lesson.languageId) {
      errors.push(
        `Lesson "${lesson.id}" uses language "${lesson.languageId}" but unit "${unit.id}" uses "${unit.languageId}".`,
      );
    }

    if (unit && !new Set<string>(unit.lessonIds).has(lesson.id)) {
      errors.push(`Lesson "${lesson.id}" is not listed in unit "${unit.id}".`);
    }

    const phraseIds = new Set(lesson.phrases.map((phrase) => phrase.id));

    collectDuplicates(
      `phrase id in lesson "${lesson.id}"`,
      lesson.phrases.map((phrase) => phrase.id),
      errors,
    );
    collectActivityPhraseErrors(lesson.id, phraseIds, lesson.activities, errors);
  }

  if (errors.length > 0) {
    throw new Error(`Learning data is invalid:\n${errors.join('\n')}`);
  }
}

function collectDuplicates(label: string, ids: string[], errors: string[]) {
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      errors.push(`Duplicate ${label} "${id}".`);
      continue;
    }

    seen.add(id);
  }
}

function collectActivityPhraseErrors(
  lessonId: LessonId,
  phraseIds: Set<PhraseId>,
  activities: LessonActivity[],
  errors: string[],
) {
  for (const activity of activities) {
    if (!hasPhraseReference(activity)) {
      continue;
    }

    if (!phraseIds.has(activity.phraseId)) {
      errors.push(
        `Activity "${activity.id}" in lesson "${lessonId}" references missing phrase "${activity.phraseId}".`,
      );
    }
  }
}

function hasPhraseReference(
  activity: LessonActivity,
): activity is LessonActivity & { phraseId: PhraseId } {
  return activity.type === 'listen-and-repeat' || activity.type === 'speak';
}
