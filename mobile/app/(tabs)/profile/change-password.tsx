import React, {useState} from 'react';
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
import {Ionicons} from '@expo/vector-icons';
import {useAuthStore} from '@/store/authStore';
import {APP_CONFIG} from '@/constants/app-config';

export default function ChangePasswordScreen() {
    const {user, logout} = useAuthStore();
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
            Alert.alert('🔐 Weak Password', 'Password must be at least 8 characters long.');
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
                body: JSON.stringify({currentPassword, newPassword, confirmPassword}),
            });

            const json = await res.json();
            if (!res.ok || json.success === false) {
                const errMsg = json.error?.message || json.message || 'Password change failed';
                throw new Error(errMsg);
            }

            Alert.alert('✅ Password Updated', 'Your password was changed successfully.', [
                {text: 'OK', onPress: () => logout()},
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
                <View style={s.iconCircle}>
                    <Ionicons name="key-outline" size={40} color="#fff"/>
                </View>

                <Text style={s.title}>Change Password</Text>
                <Text style={s.subtitle}>
                    Improve your account security 🔐
                </Text>
            </View>

            {/* Input Card */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>🔒 Secure Your Account</Text>

                {/* Current Password */}
                <View style={s.inputRow}>
                    <Ionicons name="lock-closed-outline" size={20} color="#3EB489" style={s.inputIcon}/>
                    <TextInput
                        style={s.input}
                        placeholder="Current Password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                {/* New Password */}
                <View style={s.inputRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#6C63FF" style={s.inputIcon}/>
                    <TextInput
                        style={s.input}
                        placeholder="New Password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                {/* Confirm Password */}
                <View style={s.inputRow}>
                    <Ionicons name="checkmark-done-outline" size={20} color="#FFB74D" style={s.inputIcon}/>
                    <TextInput
                        style={s.input}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#94A3B8"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                {/* Guideline */}
                <View style={s.noteBox}>
                    <Ionicons name="information-circle-outline" size={18} color="#3EB489"/>
                    <Text style={s.noteText}>
                        Use a strong password with at least 8 characters including letters and numbers.
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={s.saveBtn} onPress={handleChangePassword} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff"/>
                    ) : (
                        <>
                            <Ionicons name="refresh-outline" size={20} color="#fff"/>
                            <Text style={s.saveText}>Update Password</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    header: {
        alignItems: 'center',
        paddingTop: 40,
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3EB489',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3EB489',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginTop: 14,
    },
    subtitle: {
        color: '#6B7280',
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },

    card: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 40,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3EB489',
        marginBottom: 14,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        marginBottom: 14,
        paddingHorizontal: 10,
    },
    inputIcon: {marginRight: 8},
    input: {
        flex: 1,
        height: 44,
        color: '#1F2937',
        fontSize: 15,
    },

    noteBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0FDF4',
        padding: 10,
        borderRadius: 10,
        marginBottom: 16,
        gap: 6,
    },
    noteText: {
        color: '#166534',
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    },

    saveBtn: {
        backgroundColor: '#FFB74D',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#FFB74D',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    saveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
