import {Tabs, useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {Platform, View, StyleSheet} from 'react-native';
import React from 'react';

export default function TabsLayout() {
    const router = useRouter();

    const refreshTab = (routeName: string) => ({
        tabPress: (e: any) => {
            e.preventDefault();
            // @ts-ignore
            router.replace(`/(tabs)/${routeName}`);
        }
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#3EB489',
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
                        shadowOffset: {width: 0, height: 3},
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
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="home-outline" size={size + 1} color={color}/>
                        ),
                    }}
                    listeners={refreshTab('')}
                />

                <Tabs.Screen
                    name="record"
                    options={{
                        title: 'Record',
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="create-outline" size={size + 1} color={color}/>
                        ),
                    }}
                    listeners={refreshTab('record')}
                />

                <Tabs.Screen
                    name="activity"
                    options={{
                        title: '',
                        tabBarIcon: ({focused}) => (
                            <View style={styles.centerButton}>
                                <Ionicons name="pulse-outline" size={30} color="#fff"/>
                            </View>
                        ),
                    }}
                    listeners={refreshTab('activity')}
                />

                <Tabs.Screen
                    name="plan"
                    options={{
                        title: 'Plan',
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="restaurant-outline" size={size + 1} color={color}/>
                        ),
                    }}
                    listeners={refreshTab('plan')}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name="person-circle-outline" size={size + 1} color={color}/>
                        ),
                    }}
                    listeners={refreshTab('profile')}
                />

            </Tabs>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {flex: 1, backgroundColor: '#F9FAFB'},
    centerButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFB74D', // orange accent
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFB74D',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 26,
    },
});
