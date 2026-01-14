import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '../screens/SearchScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { AlbumDetailsScreen } from '../screens/AlbumDetailsScreen';
import { ArtistDetailsScreen } from '../screens/ArtistDetailsScreen';
import { PlaylistDetailsScreen } from '../screens/PlaylistDetailsScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';
import { useThemeStore } from '../store/useThemeStore';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    const { isDarkMode } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

    const navigationTheme = {
        ...(isDarkMode ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            primary: colors.primary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
                <Stack.Screen name="ArtistDetails" component={ArtistDetailsScreen} />
                <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} />
                <Stack.Screen name="Downloads" component={DownloadsScreen} />
                <Stack.Screen
                    name="Player"
                    component={PlayerScreen}
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
