import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { APP_CONFIG } from '@/constants/app-config';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const token = user?.token;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const menuItems = [
        { icon: 'bag-handle-outline', label: 'My Orders', action: () => router.push('/history') },
        { icon: 'cart-outline', label: 'My Cart', action: () => router.push('/cart') },
        { icon: 'person-outline', label: 'Edit Profile', action: () => router.push('/update-profile') },
        { icon: 'lock-closed-outline', label: 'Change Password', action: () => router.push('/change-password') },
        { icon: 'chatbubbles-outline', label: 'Support Center', action: () => router.push('/support') },
        { icon: 'information-circle-outline', label: 'About App', action: () => router.push('/about') },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.replace('/login');
                return;
            }

            try {
                setLoading(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.PROFILE}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                if (!res.ok || json.success === false) throw new Error(json.message);
                setProfile(json.data ?? json);
            } catch (err: any) {
                Alert.alert('Error', err.message || 'Failed to load profile');
                if (err.message?.includes('Unauthorized')) router.replace('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    if (loading) {
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator size="large" color="#00ADEF" />
                <Text style={s.loadingText}>Loading your profile...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={s.guestWrap}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5087/5087579.png' }}
                    style={s.guestImg}
                />
                <Text style={s.guestTitle}>Welcome 👋</Text>
                <Text style={s.guestText}>Login or sign up to manage your orders and prescriptions.</Text>
                <TouchableOpacity style={s.primaryBtn} onPress={() => router.push('/login')}>
                    <Text style={s.primaryText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/register')}>
                    <Text style={s.secondaryText}>Register</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            {/* Header Card */}
            <View style={s.headerCard}>
                <Image
                    source={{
                        uri: profile?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    }}
                    style={s.avatar}
                />
                <Text style={s.name}>{profile?.fullName}</Text>
                <Text style={s.email}>{profile?.email}</Text>
                {profile?.phone && <Text style={s.phone}>📞 {profile.phone}</Text>}
            </View>

            {/* Quick Stats */}
            <View style={s.statsRow}>
                <View style={s.statBox}>
                    <Text style={s.statNumber}>{profile?.orderCount ?? 0}</Text>
                    <Text style={s.statLabel}>Orders</Text>
                </View>
                <View style={s.statBox}>
                    <Text style={s.statNumber}>{profile?.points ?? 0}</Text>
                    <Text style={s.statLabel}>Reward Points</Text>
                </View>
                <View style={s.statBox}>
                    <Text style={s.statNumber}>{profile?.wishlistCount ?? 0}</Text>
                    <Text style={s.statLabel}>Wishlist</Text>
                </View>
            </View>

            {/* Menu */}
            <View style={s.menuSection}>
                {menuItems.map((item, i) => (
                    <TouchableOpacity key={i} style={s.menuItem} onPress={item.action}>
                        <View style={s.menuLeft}>
                            <Ionicons name={item.icon as any} size={22} color="#009688" />
                            <Text style={s.menuText}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout */}
            <TouchableOpacity style={s.logoutBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={18} color="#fff" />
                <Text style={s.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAF8FB' },
    loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    loadingText: { marginTop: 10, color: '#6b7280' },
    headerCard: {
        backgroundColor: '#00ADEF',
        paddingVertical: 40,
        alignItems: 'center',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 12,
    },
    name: { fontSize: 20, fontWeight: '700', color: '#fff' },
    email: { color: '#f0fdfa', fontSize: 14 },
    phone: { color: '#f0fdfa', marginTop: 4 },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 18,
        marginTop: -30,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 3,
    },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 18, fontWeight: '700', color: '#009688' },
    statLabel: { color: '#64748b', fontSize: 13 },
    menuSection: {
        backgroundColor: '#fff',
        marginTop: 20,
        marginHorizontal: 18,
        borderRadius: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    menuText: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DC2626',
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 30,
        marginHorizontal: 60,
        gap: 6,
    },
    logoutText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    guestWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 20,
        backgroundColor: '#F9FAFB',
    },
    guestImg: { width: 120, height: 120, marginBottom: 16 },
    guestTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
    guestText: { color: '#6b7280', textAlign: 'center', marginVertical: 12 },
    primaryBtn: {
        backgroundColor: '#00ADEF',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
    },
    primaryText: { color: '#fff', fontWeight: '700' },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: '#00ADEF',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 10,
    },
    secondaryText: { color: '#00ADEF', fontWeight: '600' },
});
