import { useCallStateHooks, type CallClosedCaption } from '@stream-io/video-react-native-sdk';

import { AI_TEACHER_USER_ID } from '@/lib/agent';

export type LiveCaption = CallClosedCaption & { isTeacher: boolean };

/**
 * Stream's closed-caption feature (turned on via `transcription.closed_caption_mode`
 * on the call — see app/api/stream/audio-call+api.ts) transcribes every
 * participant's published audio in real time, so this just reads that live
 * feed and tags each line by speaker rather than running any transcription
 * itself. Caption expiry/windowing (how many stay visible, for how long) is
 * handled by the SDK — see `call.updateClosedCaptionSettings()` to change it.
 */
export function useLiveCaptions(): LiveCaption[] {
  const { useCallClosedCaptions } = useCallStateHooks();
  const closedCaptions = useCallClosedCaptions();

  return closedCaptions.map((caption) => ({
    ...caption,
    isTeacher: caption.speaker_id === AI_TEACHER_USER_ID,
  }));
}
