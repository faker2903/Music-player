import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { MiniPlayer } from '../components/MiniPlayer';

const Tab = createBottomTabNavigator();

import { FavoritesScreen } from '../screens/FavoritesScreen';
import { PlaylistsScreen } from '../screens/PlaylistsScreen';

const SettingsScreen = () => (
    <View style={styles.center}>
        <Text>Settings</Text>
    </View>
);

export const MainTabNavigator = () => {
    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.textSecondary,
                    tabBarStyle: {
                        borderTopWidth: 0,
                        elevation: 0,
                        height: 60,
                        paddingBottom: 8,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '500',
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: keyof typeof Ionicons.glyphMap;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Favorites') {
                            iconName = focused ? 'heart' : 'heart-outline';
                        } else if (route.name === 'Playlists') {
                            iconName = focused ? 'document-text' : 'document-text-outline';
                        } else {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Favorites" component={FavoritesScreen} />
                <Tab.Screen name="Playlists" component={PlaylistsScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
            <MiniPlayer />
        </>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
});
