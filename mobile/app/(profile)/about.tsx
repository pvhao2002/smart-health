import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            {/* Header */}
            <View style={s.header}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2966/2966483.png' }}
                    style={s.logo}
                />
                <Text style={s.title}>PharmaCare 🩺</Text>
                <Text style={s.subtitle}>Your trusted digital pharmacy companion</Text>
            </View>

            {/* About Section */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>💡 About PharmaCare</Text>
                <Text style={s.paragraph}>
                    PharmaCare is a modern pharmacy management and e-commerce system that helps users find,
                    order, and manage medicines with ease. Our app aims to provide convenient and secure
                    healthcare support right at your fingertips.
                </Text>

                <View style={s.list}>
                    <Text style={s.item}>• Search and buy medicines online securely</Text>
                    <Text style={s.item}>• Track prescriptions and delivery status</Text>
                    <Text style={s.item}>• Access verified product details & expiry info</Text>
                    <Text style={s.item}>• Connect with licensed pharmacists anytime</Text>
                </View>
            </View>

            {/* Tech Stack */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>🧬 Tech Stack</Text>
                <View style={s.stackList}>
                    <View style={s.stackItem}>
                        <Ionicons name="logo-react" size={22} color="#00ADEF" />
                        <Text style={s.stackText}>React Native (Expo SDK 54)</Text>
                    </View>
                    <View style={s.stackItem}>
                        <Ionicons name="leaf-outline" size={22} color="#009688" />
                        <Text style={s.stackText}>Spring Boot Backend</Text>
                    </View>
                    <View style={s.stackItem}>
                        <Ionicons name="server-outline" size={22} color="#16A34A" />
                        <Text style={s.stackText}>MySQL Database</Text>
                    </View>
                    <View style={s.stackItem}>
                        <Ionicons name="lock-closed-outline" size={22} color="#F57C00" />
                        <Text style={s.stackText}>JWT Secure Authentication</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={s.footer}>
                <TouchableOpacity style={s.btn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={18} color="#fff" />
                    <Text style={s.btnText}>Back</Text>
                </TouchableOpacity>
                <Text style={s.version}>v1.0.0 — Healthy Living Starts Here 💚</Text>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAF8FB' },
    content: { padding: 20, paddingBottom: 60 },

    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    logo: { width: 90, height: 90, marginBottom: 10 },
    title: { fontSize: 24, fontWeight: '800', color: '#009688', textAlign: 'center' },
    subtitle: { color: '#1F2937', textAlign: 'center', opacity: 0.7, marginTop: 6, fontSize: 14 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#009688', marginBottom: 8 },
    paragraph: { color: '#1F2937', fontSize: 14, lineHeight: 20, marginBottom: 6 },
    bold: { fontWeight: '700', color: '#009688' },
    link: { color: '#00ADEF', textDecorationLine: 'underline' },

    list: { marginTop: 6 },
    item: { color: '#374151', marginBottom: 4, fontSize: 14 },

    stackList: { marginTop: 8 },
    stackItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 10 },
    stackText: { color: '#1F2937', fontSize: 14, fontWeight: '500' },

    footer: { alignItems: 'center', marginTop: 10 },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00ADEF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 8,
    },
    btnText: { color: '#fff', fontWeight: '700' },
    version: { color: '#6b7280', fontSize: 12, marginTop: 8 },
});
