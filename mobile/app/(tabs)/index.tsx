import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

export default function SmartHealthHome() {
    const [stats, setStats] = useState({steps: 7200, calories: 520, workouts: 2});

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={s.header}>
                <Text style={s.greeting}>Good Morning,</Text>
                <Text style={s.username}>Kira 🌿</Text>
                <Text style={s.date}>Wednesday, 12 Nov 2025</Text>
            </View>

            {/* Progress Circle (fake sample) */}
            <View style={s.progressBox}>
                <LinearGradient colors={['#3EB489', '#6C63FF']} style={s.circle}>
                    <Text style={s.circleValue}>{stats.steps}</Text>
                    <Text style={s.circleLabel}>steps</Text>
                </LinearGradient>
            </View>

            {/* Stats */}
            <View style={s.statsRow}>
                <View style={[s.statCard, {backgroundColor: '#EAFBF6'}]}>
                    <Ionicons name="flame-outline" size={22} color="#3EB489"/>
                    <Text style={s.statValue}>{stats.calories}</Text>
                    <Text style={s.statLabel}>Calories</Text>
                </View>
                <View style={[s.statCard, {backgroundColor: '#EDEAFF'}]}>
                    <Ionicons name="barbell-outline" size={22} color="#6C63FF"/>
                    <Text style={s.statValue}>{stats.workouts}</Text>
                    <Text style={s.statLabel}>Workouts</Text>
                </View>
                <View style={[s.statCard, {backgroundColor: '#FFF5E6'}]}>
                    <Ionicons name="walk-outline" size={22} color="#FFB74D"/>
                    <Text style={s.statValue}>{stats.steps}</Text>
                    <Text style={s.statLabel}>Steps</Text>
                </View>
            </View>

            {/* Recommended Workouts */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>🏋️ Recommended Workouts</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Yoga Flow', 'HIIT Burn', 'Core Strength', 'Morning Run'].map((item, idx) => (
                        <TouchableOpacity key={idx} style={s.workoutCard} activeOpacity={0.8}>
                            <Image
                                source={require('@/assets/images/workout-sample.jpg')}
                                style={s.workoutImage}
                            />
                            <Text style={s.workoutName}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Diet Menu */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>🥗 Today&#39;s Menu</Text>
                <View style={s.dietCard}>
                    <Image source={require('@/assets/images/salad.jpg')} style={s.dietImg}/>
                    <View style={{flex: 1, marginLeft: 12}}>
                        <Text style={s.dietTitle}>Avocado Chicken Salad</Text>
                        <Text style={s.dietDesc}>Healthy protein boost lunch</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF"/>
                </View>
            </View>

            {/* Tip / Motivation */}
            <View style={s.tipBox}>
                <Ionicons name="heart-outline" size={22} color="#3EB489"/>
                <Text style={s.tipText}>
                    💡 Remember to stay hydrated! Drink 2L of water today.
                </Text>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F9FAFB', padding: 16},
    header: {marginTop: 20},
    greeting: {fontSize: 18, color: '#6B7280'},
    username: {fontSize: 26, fontWeight: '800', color: '#1F2937'},
    date: {color: '#9CA3AF', marginTop: 4},

    progressBox: {alignItems: 'center', marginVertical: 24},
    circle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3EB489',
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 6,
    },
    circleValue: {color: '#fff', fontSize: 32, fontWeight: '800'},
    circleLabel: {color: '#fff', fontSize: 14, marginTop: 4},

    statsRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24},
    statCard: {
        width: '31%',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    statValue: {fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 4},
    statLabel: {color: '#6B7280', fontSize: 13},

    section: {marginBottom: 24},
    sectionTitle: {fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 10},

    workoutCard: {
        marginRight: 12,
        borderRadius: 16,
        overflow: 'hidden',
        width: 140,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    workoutImage: {width: '100%', height: 90},
    workoutName: {padding: 8, fontWeight: '600', color: '#1F2937'},

    dietCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dietImg: {width: 60, height: 60, borderRadius: 12},
    dietTitle: {fontWeight: '700', color: '#1F2937'},
    dietDesc: {fontSize: 13, color: '#6B7280', marginTop: 4},

    tipBox: {
        flexDirection: 'row',
        backgroundColor: '#EAFBF6',
        padding: 14,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    tipText: {flex: 1, marginLeft: 8, color: '#1F2937', lineHeight: 18},
});
