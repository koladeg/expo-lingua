export type LessonStatus = 'completed' | 'in-progress' | 'upcoming';

export const STATUS_LABELS: Record<LessonStatus, string> = {
  completed: 'Completed',
  'in-progress': 'In progress',
  upcoming: '0 / 6 lessons',
};

export function getMockLessonStatus(index: number): LessonStatus {
  if (index < 2) {
    return 'completed';
  }

  if (index === 2) {
    return 'in-progress';
  }

  return 'upcoming';
}
