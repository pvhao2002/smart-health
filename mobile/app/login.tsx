'use client';
import React, {useState} from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Image
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import axios from 'axios';
import {APP_CONFIG} from '@/constants/app-config';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const loginStore = useAuthStore((s) => s.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.LOGIN}`, {email, password});

            loginStore(res.data);
            Alert.alert('Thành công', 'Chào mừng bạn quay trở lại!');
            router.replace('/(tabs)/profile');

        } catch (err: any) {
            console.log(err)
            Alert.alert(
                'Đăng nhập thất bại',
                err.response?.data?.message || 'Sai thông tin đăng nhập, vui lòng thử lại'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#F9FAFB'}}
                              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                <View style={s.header}>
                    <Image
                        source={require('@/assets/images/illu.jpg')}
                        style={s.image}
                        resizeMode="contain"
                    />
                    <Text style={s.title}>Chào mừng trở lại 👋</Text>
                    <Text style={s.subtitle}>Hành trình sức khỏe của bạn bắt đầu từ đây</Text>
                </View>

                <View style={s.form}>
                    <TextInput
                        placeholder="Địa chỉ email"
                        style={s.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#94a3b8"
                    />

                    <TextInput
                        placeholder="Mật khẩu"
                        style={s.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#94a3b8"
                    />

                    <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#3EB489', '#6C63FF']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={s.btn}>
                            {loading ? (
                                <ActivityIndicator color="#fff"/>
                            ) : (
                                <Text style={s.btnText}>Đăng nhập</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={s.link}>
                            Chưa có tài khoản? <Text style={s.linkAccent}>Tạo tài khoản mới</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 28,
        backgroundColor: '#F9FAFB',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 8,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1F2937',
    },
    subtitle: {
        color: '#6b7280',
        fontSize: 15,
        marginTop: 4,
    },
    form: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 16,
        color: '#1F2937',
        backgroundColor: '#F9FAFB',
    },
    btn: {
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#3EB489',
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 5,
    },
    btnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    link: {
        textAlign: 'center',
        marginTop: 16,
        color: '#1F2937',
        fontSize: 14,
    },
    linkAccent: {
        color: '#6C63FF',
        fontWeight: '700',
    },
});
