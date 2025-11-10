import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from '@/constants/app-config';

export default function UpdateProfileScreen() {
    const { user } = useAuthStore();
    const token = user?.token;
    const router = useRouter();

    const [form, setForm] = useState({ fullName: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.replace('/login');
                return;
            }
            try {
                setLoading(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();

                if (!res.ok || json.success === false) {
                    const msg = json.error?.message || json.message || 'Failed to load profile';
                    throw new Error(msg);
                }

                const data = json.data ?? json;
                setForm({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    address: data.address || '',
                });
            } catch (err: any) {
                Alert.alert('Error', err.message || 'Cannot load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const json = await res.json();
            if (!res.ok || json.success === false) {
                const errMsg = json.error?.message || json.message || 'Update failed';
                throw new Error(errMsg);
            }

            Alert.alert('✅ Success', json.message || 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (err: any) {
            Alert.alert('❌ Error', err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator size="large" color="#00ADEF" />
                <Text style={s.loadingText}>Loading your profile...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#EAF8FB' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={s.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={s.header}>
                    <Ionicons name="person-circle-outline" size={80} color="#00ADEF" />
                    <Text style={s.title}>Update Profile</Text>
                    <Text style={s.subtitle}>Keep your personal info updated 🩺</Text>
                </View>

                {/* Card */}
                <View style={s.card}>
                    <View style={s.inputBox}>
                        <Ionicons name="person-outline" size={20} color="#009688" style={s.icon} />
                        <TextInput
                            style={s.input}
                            placeholder="Full Name"
                            value={form.fullName}
                            onChangeText={(t) => setForm({ ...form, fullName: t })}
                        />
                    </View>

                    <View style={s.inputBox}>
                        <Ionicons name="call-outline" size={20} color="#009688" style={s.icon} />
                        <TextInput
                            style={s.input}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(t) => setForm({ ...form, phone: t })}
                        />
                    </View>

                    <View style={[s.inputBox, { alignItems: 'flex-start', paddingVertical: 8 }]}>
                        <Ionicons name="home-outline" size={20} color="#009688" style={[s.icon, { marginTop: 6 }]} />
                        <TextInput
                            style={[s.input, { height: 70, textAlignVertical: 'top' }]}
                            placeholder="Full Address"
                            multiline
                            value={form.address}
                            onChangeText={(t) => setForm({ ...form, address: t })}
                        />
                    </View>

                    <TouchableOpacity
                        style={s.saveBtn}
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.85}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="#fff" />
                                <Text style={s.saveText}>Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer Hint */}
                <View style={s.footerNote}>
                    <Ionicons name="shield-checkmark-outline" size={18} color="#00ADEF" />
                    <Text style={s.footerText}>
                        Your personal data is encrypted and securely stored in our system.
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 60,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 18,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#009688',
        marginTop: 6,
    },
    subtitle: {
        color: '#1F2937',
        opacity: 0.7,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 12,
        paddingHorizontal: 10,
        backgroundColor: '#F9FAFB',
        marginBottom: 14,
    },
    icon: { marginRight: 8 },
    input: {
        flex: 1,
        height: 44,
        fontSize: 15,
        color: '#1F2937',
    },
    saveBtn: {
        backgroundColor: '#00ADEF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 14,
        gap: 8,
        shadowColor: '#00ADEF',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
        marginTop: 12,
    },
    saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        paddingHorizontal: 24,
        gap: 6,
    },
    footerText: {
        color: '#475569',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
        flex: 1,
    },

    loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAF8FB' },
    loadingText: { color: '#6b7280', marginTop: 10 },
});
