import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
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
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.LOGIN}`, {
                email,
                password,
            });
            const data = res.data;
            if (data) {
                loginStore(data);
                Alert.alert('Success', 'Welcome back!');
                router.replace('/(tabs)/profile');
            } else Alert.alert('Error', 'Invalid response from server');
        } catch (err: any) {
            Alert.alert('Login failed', err.response?.data?.message || 'Please check your credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#F9FAFB'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                <View style={s.header}>
                    <Image
                        source={require('@/assets/images/logo-illu.jpg')}
                        style={s.image}
                        resizeMode="contain"
                    />
                    <Text style={s.title}>Welcome Back</Text>
                    <Text style={s.subtitle}>Your wellness journey starts here 🌿</Text>
                </View>

                {/* Form */}
                <View style={s.form}>
                    <TextInput
                        placeholder="Email address"
                        style={s.input}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        placeholderTextColor="#94a3b8"
                    />
                    <TextInput
                        placeholder="Password"
                        style={s.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#94a3b8"
                    />

                    <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.btnText}>Sign In</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={s.link}>
                            New here? <Text style={s.linkAccent}>Create an account</Text>
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
        marginBottom: 12,
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
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 3},
        shadowRadius: 5,
        elevation: 2,
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
        backgroundColor: '#00ADEF',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#00ADEF',
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
        marginTop: 10,
        color: '#1F2937',
        fontSize: 14,
    },
    linkAccent: {
        color: '#009688',
        fontWeight: '700',
    },
});
