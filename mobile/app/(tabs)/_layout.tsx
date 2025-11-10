import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import React from 'react';

export default function TabsLayout() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#00ADEF',
                    tabBarInactiveTintColor: '#9CA3AF',
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        marginBottom: Platform.OS === 'ios' ? 4 : 6,
                    },
                    tabBarStyle: {
                        position: 'absolute',
                        left: 16,
                        right: 16,
                        bottom: Platform.OS === 'ios' ? 20 : 14,
                        borderRadius: 26,
                        height: 68,
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 5,
                        borderTopWidth: 0,
                        paddingTop: 4,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size + 1} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="medicine"
                    options={{
                        title: 'Medicines',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="medkit-outline" size={size + 1} color={color} />
                        ),
                    }}
                />

                {/* 🌟 Middle "Cart" tab – standout design */}
                <Tabs.Screen
                    name="cart"
                    options={{
                        title: '',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View style={styles.cartButton}>
                                <Ionicons
                                    name="cart-outline"
                                    size={28}
                                    color={focused ? '#fff' : '#fff'}
                                />
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'History',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="time-outline" size={size + 1} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-circle-outline" size={size + 1} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9FAFB' },

    cartButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F57C00',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#F57C00',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 24,
    },
});
