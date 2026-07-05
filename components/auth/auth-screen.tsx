import { images } from '@/constants/images';
import { isClerkAPIResponseError, useAuth, useSignIn, useSignUp, useSSO } from '@clerk/expo';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link, Redirect, router, type Href } from 'expo-router';
import type { MutableRefObject } from 'react';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const codeLength = 6;

type AuthMode = 'sign-up' | 'sign-in';
type SocialProvider = 'google' | 'facebook' | 'apple';
type ActiveVerificationFlow = AuthMode | null;

type AuthScreenProps = {
  mode: AuthMode;
};

const authCopy = {
  'sign-up': {
    title: 'Create your account',
    subtitle: 'Start your language journey today ✨',
    button: 'Sign Up',
    footerText: 'Already have an account?',
    footerAction: 'Log in',
    footerHref: '/sign-in' as Href,
    email: 'alex@gmail.com',
  },
  'sign-in': {
    title: 'Welcome back',
    subtitle: 'Continue your language journey ✨',
    button: 'Sign In',
    footerText: "Don't have an account?",
    footerAction: 'Sign up',
    footerHref: '/sign-up' as Href,
    email: 'alex@gmail.com',
  },
} as const;

const socialOptions = [
  { label: 'Continue with Google', provider: 'google' },
  { label: 'Continue with Facebook', provider: 'facebook' },
  { label: 'Continue with Apple', provider: 'apple' },
] as const;

export function AuthScreen({ mode }: AuthScreenProps) {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const copy = authCopy[mode];
  const isSignUp = mode === 'sign-up';
  const [email, setEmail] = useState<string>(copy.email);
  const [password, setPassword] = useState<string>('password1');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeVerificationFlow, setActiveVerificationFlow] =
    useState<ActiveVerificationFlow>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState<string[]>(Array.from({ length: codeLength }, () => ''));
  const codeInputs = useRef<(TextInput | null)[]>([]);
  const isFetching =
    isSubmitting || signInFetchStatus === 'fetching' || signUpFetchStatus === 'fetching';

  if (isAuthLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  const openVerificationModal = (flow: AuthMode) => {
    setActiveVerificationFlow(flow);
    setCode(Array.from({ length: codeLength }, () => ''));
    setIsModalVisible(true);
    setTimeout(() => {
      codeInputs.current[0]?.focus();
    }, 100);
  };

  const finishAuth = async (flow: AuthMode) => {
    const resource = flow === 'sign-up' ? signUp : signIn;

    if (!resource) {
      throw new Error('Authentication is not ready yet.');
    }

    const { error } = await resource.finalize();

    if (error) {
      throw error;
    }

    setIsModalVisible(false);
    router.replace('/');
  };

  const handlePrimaryPress = async () => {
    if (!signIn || !signUp) {
      return;
    }

    const emailAddress = email.trim();

    if (!emailAddress) {
      Alert.alert('Email required', 'Enter your email address to continue.');
      return;
    }

    if (isSignUp && !password) {
      Alert.alert('Password required', 'Enter a password to create your account.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp.password({ emailAddress, password });

        if (error) {
          throw error;
        }

        if (signUp.status === 'complete') {
          await finishAuth('sign-up');
          return;
        }

        const verification = await signUp.verifications.sendEmailCode();

        if (verification.error) {
          throw verification.error;
        }

        openVerificationModal('sign-up');
        return;
      }

      const { error } = await signIn.emailCode.sendCode({ emailAddress });

      if (error) {
        throw error;
      }

      openVerificationModal('sign-in');
    } catch (error) {
      showAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    if (!signIn || !signUp || !activeVerificationFlow || verificationCode.length !== codeLength) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeVerificationFlow === 'sign-up') {
        const { error } = await signUp.verifications.verifyEmailCode({
          code: verificationCode,
        });

        if (error) {
          throw error;
        }

        await finishAuth('sign-up');
        return;
      }

      const { error } = await signIn.emailCode.verifyCode({
        code: verificationCode,
      });

      if (error) {
        throw error;
      }

      await finishAuth('sign-in');
    } catch (error) {
      showAuthError(error);
      setCode(Array.from({ length: codeLength }, () => ''));
      codeInputs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialPress = async (provider: SocialProvider) => {
    if (provider !== 'google') {
      Alert.alert(
        'Provider not enabled',
        'This Clerk project currently supports Google social sign-in.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (error) {
      showAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    const nextDigit = value.replace(/\D/g, '').slice(-1);
    const nextCode = [...code];
    nextCode[index] = nextDigit;
    setCode(nextCode);

    if (!nextDigit) {
      return;
    }

    if (index < codeLength - 1) {
      codeInputs.current[index + 1]?.focus();
      return;
    }

    if (nextCode.every(Boolean)) {
      void handleVerifyCode(nextCode.join(''));
    }
  };

  const handleCodeKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}>
        <View className="min-h-full px-[31px] pb-7 pt-[28px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-[38px] w-[38px] items-start justify-center"
            onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={32} color="#050A22" />
          </Pressable>

          <View className="mt-[28px]">
            <Text className="font-lingua-bold text-[29px] leading-[38px] text-[#050A22]">
              {copy.title}
            </Text>
            <Text className="mt-[10px] font-lingua-regular text-[19px] leading-[28px] text-[#66708B]">
              {copy.subtitle}
            </Text>
          </View>

          <View className="relative mt-[18px] h-[154px] items-center justify-end overflow-visible">
            <Text className="absolute left-[79px] top-[54px] z-10 font-lingua-bold text-[28px] leading-[32px] text-[#FF8A00]">
              ✦
            </Text>
            <Text className="absolute right-[71px] top-[59px] z-10 font-lingua-bold text-[25px] leading-[30px] text-[#7CB6FF]">
              ✦
            </Text>
            <Text className="absolute right-[34px] top-[100px] z-10 font-lingua-bold text-[28px] leading-[32px] text-[#FFD75E]">
              ✦
            </Text>
            <Image source={images.mascotAuth} style={styles.mascot} contentFit="contain" />
          </View>

          <View className="-mt-[4px] gap-[14px]">
            <View className="h-[84px] justify-center rounded-[16px] border-[1.5px] border-[#EEF0F5] bg-white px-[18px]">
              <Text className="font-lingua-semibold text-[16px] leading-[22px] text-[#737B96]">
                Email
              </Text>
              <TextInput
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                onChangeText={setEmail}
                style={styles.inputText}
              />
            </View>

            {isSignUp ? (
              <View className="h-[84px] justify-center rounded-[16px] border-[1.5px] border-[#EEF0F5] bg-white px-[18px]">
                <Text className="font-lingua-semibold text-[16px] leading-[22px] text-[#737B96]">
                  Password
                </Text>
                <View className="flex-row items-center justify-between">
                  <TextInput
                    value={password}
                    secureTextEntry={!isPasswordVisible}
                    underlineColorAndroid="transparent"
                    onChangeText={setPassword}
                    style={[styles.inputText, styles.passwordInput]}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                    onPress={() => setIsPasswordVisible((current) => !current)}>
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={29}
                      color="#69728F"
                    />
                  </Pressable>
                </View>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={isFetching}
              className="mt-[12px] h-[67px] items-center justify-center rounded-[14px] bg-[#6442F5]"
              onPress={handlePrimaryPress}
              style={styles.primaryButton}>
              <Text className="font-lingua-bold text-[20px] leading-[27px] text-white">
                {copy.button}
              </Text>
            </Pressable>
          </View>

          <View className="my-[34px] flex-row items-center gap-[21px]">
            <View className="h-[1px] flex-1 bg-[#E8EAF1]" />
            <Text className="font-lingua-regular text-[17px] leading-[24px] text-[#737B96]">
              or continue with
            </Text>
            <View className="h-[1px] flex-1 bg-[#E8EAF1]" />
          </View>

          <View className="gap-[13px]">
            {socialOptions.map((option) => (
              <Pressable
                key={option.provider}
                disabled={isFetching}
                className="h-[58px] flex-row items-center justify-center rounded-[14px] border-[1.5px] border-[#F0F1F5] bg-white"
                onPress={() => handleSocialPress(option.provider)}>
                <View className="absolute left-[51px]">{renderSocialIcon(option.provider)}</View>
                <Text className="font-lingua-medium text-[18px] leading-[25px] text-[#08102B]">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View className="mt-auto items-center pt-[76px]">
            <Text className="font-lingua-regular text-[18px] leading-[26px] text-[#737B96]">
              {copy.footerText}{' '}
              <Link href={copy.footerHref}>
                <Text className="font-lingua-bold text-[18px] leading-[26px] text-[#6442F5]">
                  {copy.footerAction}
                </Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>

      <VerificationModal
        code={code}
        inputRefs={codeInputs}
        isVisible={isModalVisible}
        isVerifying={isSubmitting}
        onChangeDigit={handleCodeChange}
        onClose={() => {
          setIsModalVisible(false);
          setActiveVerificationFlow(null);
        }}
        onKeyPress={handleCodeKeyPress}
      />
    </SafeAreaView>
  );
}

type VerificationModalProps = {
  code: string[];
  inputRefs: MutableRefObject<(TextInput | null)[]>;
  isVisible: boolean;
  isVerifying: boolean;
  onChangeDigit: (value: string, index: number) => void;
  onClose: () => void;
  onKeyPress: (key: string, index: number) => void;
};

function VerificationModal({
  code,
  inputRefs,
  isVisible,
  isVerifying,
  onChangeDigit,
  onClose,
  onKeyPress,
}: VerificationModalProps) {
  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalKeyboardView}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View className="rounded-t-[28px] bg-white px-[24px] pb-[32px] pt-[28px]">
          <View className="items-center">
            <Text className="font-lingua-bold text-[25px] leading-[32px] text-[#050A22]">
              Check your email
            </Text>
            <Text className="mt-3 text-center font-lingua-regular text-[15px] leading-[24px] text-[#66708B]">
              You received an email with a verification code. Enter it below to continue.
            </Text>
          </View>

          <View className="mt-7 flex-row justify-between gap-2">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(input) => {
                  inputRefs.current[index] = input;
                }}
                value={digit}
                keyboardType="number-pad"
                maxLength={1}
                selectionColor="#6442F5"
                textContentType="oneTimeCode"
                underlineColorAndroid="transparent"
                editable={!isVerifying}
                onChangeText={(value) => onChangeDigit(value, index)}
                onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index)}
                style={styles.codeInput}
              />
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function renderSocialIcon(provider: SocialProvider) {
  if (provider === 'google') {
    return (
      <Text className="font-lingua-bold text-[31px] leading-[35px] text-[#4285F4]">
        G
      </Text>
    );
  }

  if (provider === 'facebook') {
    return <FontAwesome name="facebook-official" size={31} color="#1877F2" />;
  }

  return <FontAwesome name="apple" size={34} color="#050A22" />;
}

function showAuthError(error: unknown) {
  Alert.alert('Authentication error', getAuthErrorMessage(error));
}

function getAuthErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.message ?? 'Please check your details and try again.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Please check your details and try again.';
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mascot: {
    height: 177,
    width: 242,
  },
  inputText: {
    color: '#050A22',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    lineHeight: 25,
    marginTop: 6,
    padding: 0,
  },
  passwordInput: {
    flex: 1,
    letterSpacing: 2,
    marginRight: 12,
  },
  primaryButton: {
    boxShadow: '0 4px 0 #4E2FE4',
  },
  modalKeyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 10, 34, 0.34)',
  },
  codeInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8EAF1',
    borderRadius: 14,
    borderWidth: 1.5,
    color: '#050A22',
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    height: 58,
    lineHeight: 29,
    padding: 0,
    textAlign: 'center',
  },
});
