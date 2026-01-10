import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '../screens/SearchScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { AlbumDetailsScreen } from '../screens/AlbumDetailsScreen';
import { ArtistDetailsScreen } from '../screens/ArtistDetailsScreen';
import { PlaylistDetailsScreen } from '../screens/PlaylistDetailsScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                }}
            >
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
                <Stack.Screen name="ArtistDetails" component={ArtistDetailsScreen} />
                <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} />
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
