import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { APP_CONFIG } from '@/constants/app-config';

export default function ChangePasswordScreen() {
    const { user, logout } = useAuthStore();
    const token = user?.token;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('⚠️ Missing Info', 'Please fill in all required fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('❌ Error', 'New passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('🔒 Weak Password', 'Password must be at least 8 characters long.');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            const json = await res.json();
            if (!res.ok || json.success === false) {
                const errMsg = json.error?.message || json.message || 'Password change failed';
                throw new Error(errMsg);
            }

            Alert.alert('✅ Password Changed', json.message || 'Your password was updated successfully.', [
                {
                    text: 'OK',
                    onPress: () => logout(),
                },
            ]);
        } catch (err: any) {
            Alert.alert('❌ Error', err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={s.header}>
                <Ionicons name="key-outline" size={50} color="#00ADEF" />
                <Text style={s.title}>Change Password</Text>
                <Text style={s.subtitle}>Keep your account secure 🔐</Text>
            </View>

            {/* Input Fields */}
            <View style={s.card}>
                <View style={s.inputBox}>
                    <Ionicons name="lock-closed-outline" size={20} color="#009688" style={s.icon} />
                    <TextInput
                        style={s.input}
                        placeholder="Current Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={s.inputBox}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#009688" style={s.icon} />
                    <TextInput
                        style={s.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={s.inputBox}>
                    <Ionicons name="checkmark-done-outline" size={20} color="#009688" style={s.icon} />
                    <TextInput
                        style={s.input}
                        placeholder="Confirm New Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={s.noteBox}>
                    <Ionicons name="information-circle-outline" size={18} color="#00ADEF" />
                    <Text style={s.noteText}>Password must be at least 8 characters, with letters and numbers.</Text>
                </View>

                <TouchableOpacity style={s.saveBtn} onPress={handleChangePassword} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="refresh-outline" size={20} color="#fff" />
                            <Text style={s.saveText}>Update Password</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAF8FB' },
    header: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '800', color: '#009688', marginTop: 10 },
    subtitle: { color: '#1F2937', fontSize: 14, opacity: 0.7 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 40,
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
    input: { flex: 1, height: 44, fontSize: 15, color: '#1F2937' },

    noteBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
        gap: 6,
    },
    noteText: { color: '#475569', fontSize: 13, flex: 1, lineHeight: 18 },

    saveBtn: {
        backgroundColor: '#00ADEF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 14,
        gap: 8,
        shadowColor: '#00ADEF',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
