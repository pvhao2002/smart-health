import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {useAuthStore} from '@/store/authStore';
import {APP_CONFIG} from '@/constants/app-config';

export default function ProfileScreen() {
    const router = useRouter();
    const {user, logout} = useAuthStore();
    const token = user?.token;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const {refresh} = useLocalSearchParams();

    const menuItems = [
        {icon: 'person-outline', label: 'Edit Profile', action: () => router.push('/profile/update-profile')},
        {icon: 'lock-closed-outline', label: 'Change Password', action: () => router.push('/profile/change-password')},
        {icon: 'fitness-outline', label: 'Health Goals', action: () => router.push('/activity')},
        {icon: 'restaurant-outline', label: 'Meal Preferences', action: () => router.push('/plan')},
        {icon: 'barbell-outline', label: 'Workout Preferences', action: () => router.push('/plan')},
        {icon: 'information-circle-outline', label: 'About App', action: () => router.push('/profile/about')},
        {icon: 'chatbubbles-outline', label: 'Support Center', action: () => router.push('/profile/support')},
    ];

    useEffect(() => {
        const load = async () => {
            if (!token) return router.replace('/login');
            try {
                setLoading(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.PROFILE}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.message);
                setProfile(json.data ?? json);
            } catch (e: any) {
                Alert.alert('Error', e.message || 'Failed to load profile');
            } finally {
                setLoading(false);
                router.setParams({});
            }
        };
        load();
    }, [token, refresh]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '--';
        const d = new Date(dateString);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    };


    if (loading)
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator size="large" color="#3EB489"/>
                <Text style={s.loadingText}>Loading profile…</Text>
            </View>
        );

    return (
        <ScrollView
            style={s.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 140}}
        >
            {/* Header */}
            <View style={s.headerCard}>
                <Image
                    source={{
                        uri:
                            profile?.avatar ||
                            'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    }}
                    style={s.avatar}
                />
                <Text style={s.name}>{profile?.fullName}</Text>
                <Text style={s.email}>{profile?.email}</Text>
            </View>

            {/* Health Stats */}
            <View style={s.statsRow}>
                <View style={s.statBox}>
                    <Ionicons name="body-outline" size={26} color="#3EB489"/>
                    <Text style={s.statValue}>{profile?.bmi ?? '--'}</Text>
                    <Text style={s.statLabel}>BMI</Text>
                </View>
                <View style={s.statBox}>
                    <Ionicons name="flame-outline" size={26} color="#FFB74D"/>
                    <Text style={s.statValue}>{profile?.bmr ?? '--'}</Text>
                    <Text style={s.statLabel}>BMR</Text>
                </View>
                <View style={s.statBox}>
                    <Ionicons name="pulse-outline" size={26} color="#6C63FF"/>
                    <Text style={s.statValue}>{profile?.tdee ?? '--'}</Text>
                    <Text style={s.statLabel}>TDEE</Text>
                </View>
            </View>
            {/* Tip: Understanding BMI, BMR, TDEE */}
            <View style={s.tipCard}>
                <Text style={s.tipTitle}>📘 Understanding Your Health Metrics</Text>

                <View style={s.tipItem}>
                    <Ionicons name="body-outline" size={20} color="#3EB489"/>
                    <View style={{marginLeft: 10}}>
                        <Text style={s.tipHeading}>BMI – Body Mass Index</Text>
                        <Text style={s.tipText}>
                            BMI tells whether your weight is appropriate for your height. It helps identify if you are
                            underweight, normal, overweight, or obese.
                        </Text>
                    </View>
                </View>

                <View style={s.tipItem}>
                    <Ionicons name="flame-outline" size={20} color="#FFB74D"/>
                    <View style={{marginLeft: 10}}>
                        <Text style={s.tipHeading}>BMR – Basal Metabolic Rate</Text>
                        <Text style={s.tipText}>
                            BMR is the number of calories your body burns at rest. It reflects how much energy you
                            need just to maintain basic functions like breathing and circulation.
                        </Text>
                    </View>
                </View>

                <View style={s.tipItem}>
                    <Ionicons name="pulse-outline" size={20} color="#6C63FF"/>
                    <View style={{marginLeft: 10}}>
                        <Text style={s.tipHeading}>TDEE – Total Daily Energy Expenditure</Text>
                        <Text style={s.tipText}>
                            TDEE = BMR × Activity Level. It estimates how many calories you burn daily based on
                            your lifestyle and activity intensity.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Personal Info */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>👤 Personal Information</Text>
                <InfoRow label="Full Name" value={profile?.fullName}/>
                <InfoRow label="Age" value={profile?.age}/>
                <InfoRow label="Birth Date" value={profile?.birthDate}/>
                <InfoRow label="Activity Level" value={profile?.activityLevel} highlight/>
                <InfoRow label="Goal" value={profile?.goal} highlight/>
            </View>

            {/* Body Measurements */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>📏 Body Measurements</Text>
                <InfoRow label="Height (cm)" value={profile?.heightCm}/>
                <InfoRow label="Weight (kg)" value={profile?.weightKg}/>
                <InfoRow label="Target Weight" value={profile?.targetWeightKg}/>
            </View>

            {/* Account Info */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>🔐 Account Details</Text>
                <InfoRow label="Role" value={profile?.role}/>
                <InfoRow label="Status" value={profile?.isActive ? "Active" : "Inactive"}/>
                <InfoRow label="Created At" value={formatDate(profile?.createdAt)}/>
                <InfoRow label="Updated At" value={formatDate(profile?.updatedAt)}/>
            </View>

            {/* Menu */}
            <View style={s.menuSection}>
                {menuItems.map((item, i) => (
                    <TouchableOpacity key={i} style={s.menuItem} onPress={item.action}>
                        <View style={s.menuLeft}>
                            <Ionicons name={item.icon as any} size={22} color="#3EB489"/>
                            <Text style={s.menuText}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8"/>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={s.logoutBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={18} color="#fff"/>
                <Text style={s.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function InfoRow({label, value, highlight = false}: any) {
    return (
        <View style={s.infoRow}>
            <Text style={s.infoLabel}>{label}</Text>
            <Text style={[s.infoValue, highlight && {color: "#3EB489", fontWeight: "700"}]}>
                {value ?? "--"}
            </Text>
        </View>
    );
}

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F9FAFB'},

    loadingWrap: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    loadingText: {marginTop: 10, color: '#6b7280'},

    headerCard: {
        backgroundColor: '#3EB489',
        paddingVertical: 50,
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#ffffff',
        marginBottom: 12,
    },
    name: {fontSize: 22, fontWeight: '700', color: '#fff'},
    email: {color: '#e0f7ef', fontSize: 14, marginTop: 4},

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: -30,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
        elevation: 3,
    },
    statBox: {alignItems: 'center'},
    statValue: {fontSize: 18, fontWeight: '700', color: '#1F2937', marginTop: 4},
    statLabel: {color: '#6b7280', fontSize: 13},

    card: {
        backgroundColor: '#fff',
        marginTop: 25,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    sectionTitle: {fontSize: 17, fontWeight: '700', color: '#3EB489', marginBottom: 12},

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#f3f4f6'
    },
    infoLabel: {color: '#374151', fontSize: 14},
    infoValue: {color: '#111827', fontSize: 14, fontWeight: '500'},

    menuSection: {
        backgroundColor: '#fff',
        marginTop: 30,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderColor: '#eef2f4',
    },
    menuLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
    menuText: {fontSize: 15, fontWeight: '500', color: '#1F2937'},

    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DC2626',
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 30,
        marginHorizontal: 80,
        gap: 6,
    },
    logoutText: {color: '#fff', fontWeight: '700', fontSize: 15},
    tipCard: {
        backgroundColor: '#fff',
        padding: 18,
        marginHorizontal: 20,
        marginTop: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3EB489',
        marginBottom: 12,
    },
    tipItem: {
        flexDirection: 'row',
        marginBottom: 14,
        alignItems: 'flex-start',
    },
    tipHeading: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    },
    tipText: {
        fontSize: 13,
        color: '#4B5563',
        marginTop: 2,
        lineHeight: 18,
    },
});
