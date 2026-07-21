export type AudioCallCredentials = {
  apiKey: string;
  token: string;
  userId: string;
  callId: string;
  callType: string;
};

type RequestAudioCallCredentialsArgs = {
  getToken: () => Promise<string | null>;
  lessonId: string;
  languageId: string;
  displayName?: string | null;
  imageUrl?: string | null;
};

/**
 * Asks the Expo API route to verify the signed-in Clerk user, then mint a
 * Stream user token and create/join the audio call for this lesson. The
 * Stream API secret never reaches the client — only the response below does.
 */
export async function requestAudioCallCredentials({
  getToken,
  lessonId,
  languageId,
  displayName,
  imageUrl,
}: RequestAudioCallCredentialsArgs): Promise<AudioCallCredentials> {
  const sessionToken = await getToken();

  if (!sessionToken) {
    throw new Error('You need to be signed in to start this lesson.');
  }

  const response = await fetch('/api/stream/audio-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ lessonId, languageId, displayName, imageUrl }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Unable to start the audio lesson call.');
  }

  return response.json();
}
