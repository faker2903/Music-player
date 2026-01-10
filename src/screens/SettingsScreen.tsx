import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export const SettingsScreen = () => {
    const { isDarkMode, toggleTheme } = useThemeStore();
    const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

    const SettingItem = ({ icon, title, value, onPress, showArrow = true }: any) => (
        <TouchableOpacity
            style={[styles.item, { borderBottomColor: colors.border }]}
            onPress={onPress}
        >
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={22} color={colors.text} />
                <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
            </View>
            <View style={styles.itemRight}>
                {value && <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>}
                {showArrow && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance</Text>
                    <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingItem
                            icon={isDarkMode ? "moon" : "sunny"}
                            title="Dark Mode"
                            value={isDarkMode ? "On" : "Off"}
                            onPress={toggleTheme}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>Account</Text>
                    <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingItem icon="person-outline" title="Profile" />
                        <SettingItem icon="notifications-outline" title="Notifications" />
                        <SettingItem icon="lock-closed-outline" title="Privacy" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.primary }]}>About</Text>
                    <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <SettingItem icon="information-circle-outline" title="Version" value="1.0.0" showArrow={false} />
                        <SettingItem icon="help-circle-outline" title="Help & Support" />
                        <SettingItem icon="star-outline" title="Rate Us" />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '700',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginTop: SPACING.l,
        paddingHorizontal: SPACING.m,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.s,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: SPACING.s,
        marginLeft: SPACING.s,
    },
    sectionContent: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.m,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: '500',
        marginLeft: SPACING.m,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: FONT_SIZE.s,
        marginRight: SPACING.s,
    },
    logoutButton: {
        marginTop: SPACING.xl,
        marginHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        borderRadius: 16,
        backgroundColor: '#FF3B3015',
        alignItems: 'center',
    },
    logoutText: {
        color: '#FF3B30',
        fontSize: FONT_SIZE.m,
        fontWeight: '700',
    },
});
