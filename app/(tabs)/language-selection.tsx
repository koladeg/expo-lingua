import { images } from '@/constants/images';
import { defaultLanguageId, languages } from '@/data/languages';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguageStore } from '@/store/language-store';
import type { LanguageId } from '@/types/learning';

export default function LanguageSelectionScreen() {
  const storedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguageId>(
    storedLanguageId ?? defaultLanguageId,
  );
  const [search, setSearch] = useState('');

  const visibleLanguages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return languages;
    }

    return languages.filter((language) => {
      return (
        language.name.toLowerCase().includes(query) ||
        language.nativeName.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const selectedLanguage = languages.find((language) => language.id === selectedLanguageId);
  const handleConfirmLanguage = () => {
    setSelectedLanguage(selectedLanguageId);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>
        <View className="min-h-full px-[26px] pb-0 pt-[18px]">
          <View className="relative h-[46px] items-center justify-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="absolute left-0 h-[44px] w-[44px] items-start justify-center"
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={32} color="#050A22" />
            </Pressable>

            <Text className="font-lingua-semibold text-[22px] leading-[30px] text-[#050A22]">
              Choose a language
            </Text>
          </View>

          <View style={styles.searchField}>
            <Ionicons name="search-outline" size={27} color="#5F6B8A" />
            <TextInput
              value={search}
              placeholder="Search languages"
              placeholderTextColor="#737B96"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#7A5CFF"
              underlineColorAndroid="transparent"
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <Text className="mt-[33px] font-lingua-semibold text-[20px] leading-[28px] text-[#050A22]">
            Popular
          </Text>

          <View className="mt-[20px] gap-[8px]">
            {visibleLanguages.map((language) => {
              const isSelected = language.id === selectedLanguageId;

              return (
                <Pressable
                  key={language.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedLanguageId(language.id)}
                  style={[styles.languageCard, isSelected && styles.selectedLanguageCard]}>
                  <Image
                    source={{ uri: language.flag.imageUrl }}
                    style={styles.flag}
                    contentFit="cover"
                    accessibilityLabel={language.flag.alt}
                  />

                  <View className="flex-1">
                    <Text className="font-lingua-semibold text-[20px] leading-[28px] text-[#050A22]">
                      {language.name}
                    </Text>
                    <Text className="mt-[2px] font-lingua-regular text-[16px] leading-[23px] text-[#69728F]">
                      {language.nativeName}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={25} color="#FFFFFF" />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={27} color="#69728F" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            className="mt-[24px] h-[66px] flex-row items-center justify-center gap-3 rounded-[21px] bg-[#6442F5]"
            onPress={handleConfirmLanguage}>
            <Text className="font-lingua-bold text-[19px] leading-[26px] text-white">
              Confirm {selectedLanguage?.name ?? 'language'}
            </Text>
            <Ionicons name="checkmark-circle" size={25} color="#FFFFFF" />
          </Pressable>

          <View className="mt-auto h-[185px] items-center justify-end overflow-hidden pt-[14px]">
            <Image source={images.earth} style={styles.earth} contentFit="contain" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  searchField: {
    alignItems: 'center',
    backgroundColor: '#FAFAFD',
    borderColor: '#E8EAF1',
    borderRadius: 25,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 16,
    height: 60,
    marginTop: 24,
    paddingHorizontal: 21,
  },
  searchInput: {
    color: '#050A22',
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    lineHeight: 25,
    padding: 0,
  },
  languageCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F0F1F6',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 18,
    minHeight: 92,
    paddingHorizontal: 18,
  },
  selectedLanguageCard: {
    backgroundColor: '#F8F6FF',
    borderColor: '#8C6BFF',
    borderWidth: 2,
  },
  flag: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  checkCircle: {
    alignItems: 'center',
    backgroundColor: '#6442F5',
    borderColor: '#8C6BFF',
    borderRadius: 19,
    borderWidth: 2,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  earth: {
    height: 226,
    marginBottom: -58,
    width: 390,
  },
});
