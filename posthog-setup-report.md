<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the kola_lingo Expo app. PostHog is now initialized via `lib/posthog.ts` using `expo-constants` to read credentials from `app.config.js` extras. The `PostHogProvider` wraps the root layout in `app/_layout.tsx` with autocapture enabled for touch events and manual screen tracking via `posthog.screen()` on every route change. Eight business events are captured across five screens, covering the full user journey from onboarding through authentication, language selection, and lesson engagement. Users are identified with `posthog.identify()` on sign-up and sign-in, and again on home screen load using their Clerk user ID.

| Event | Description | File |
|---|---|---|
| `get_started_pressed` | User presses the Get Started button on the onboarding screen, entering the signup funnel. | `app/onboarding.tsx` |
| `user_signed_up` | User successfully completes email/password sign-up and email verification. | `components/auth/auth-screen.tsx` |
| `user_signed_in` | User successfully signs in with email OTP code verification. | `components/auth/auth-screen.tsx` |
| `social_auth_attempted` | User taps a social auth provider (Google, Facebook, Apple) on the auth screen. | `components/auth/auth-screen.tsx` |
| `auth_error_occurred` | An authentication error is shown to the user during sign-up or sign-in. | `components/auth/auth-screen.tsx` |
| `language_confirmed` | User confirms their selected language and is redirected to the home screen. | `app/(tabs)/language-selection.tsx` |
| `lesson_continued` | User taps Continue on the home screen to resume their current lesson. | `app/(tabs)/index.tsx` |
| `daily_goal_viewed` | User views their daily XP goal progress on the home screen (top of engagement funnel). | `app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/499068/dashboard/1802469)
- [Sign-ups over time](https://us.posthog.com/project/499068/insights/ptRu8FGI)
- [Sign-ups vs Sign-ins](https://us.posthog.com/project/499068/insights/h0rICBm6)
- [Auth errors](https://us.posthog.com/project/499068/insights/WMyIJuVf)
- [Language selections by language](https://us.posthog.com/project/499068/insights/Jy5vbfYq)
- [Lesson engagement](https://us.posthog.com/project/499068/insights/uSezZPlH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
