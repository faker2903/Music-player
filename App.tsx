import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useThemeStore } from './src/store/useThemeStore';
import { LIGHT_COLORS, DARK_COLORS } from './src/constants/theme';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';

export default function App() {
  const { isDarkMode } = useThemeStore();
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  React.useEffect(() => {
    async function setupAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });
      } catch (e) {
        console.log('Error setting up audio mode:', e);
      }
    }
    setupAudio();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
