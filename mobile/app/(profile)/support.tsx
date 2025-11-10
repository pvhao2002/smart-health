import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SupportScreen() {
    const router = useRouter();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const faqs = [
        {
            q: 'How can I track my medicine delivery?',
            a: 'Go to “My Orders” → select your order → tap “Track Delivery”. You’ll see live updates from our logistics partner.',
        },
        {
            q: 'Can I return a medicine if it’s incorrect or damaged?',
            a: 'Yes. If your order is incorrect or damaged, please contact us within 3 days of delivery for a free replacement or refund.',
        },
        {
            q: 'Are my online payments secure?',
            a: 'Absolutely. We use end-to-end encryption with trusted payment gateways (VNPay, MoMo, Visa, MasterCard).',
        },
        {
            q: 'Can I upload my prescription?',
            a: 'Yes. In “Upload Prescription” section, you can attach your doctor’s prescription for our pharmacists to verify.',
        },
        {
            q: 'Do you sell genuine medicines?',
            a: 'All products on PharmaCare are 100% verified and sourced directly from licensed distributors and manufacturers.',
        },
        {
            q: 'How do I contact a pharmacist?',
            a: 'Go to “Consult a Pharmacist” on the home page to start a live chat or request a callback.',
        },
        {
            q: 'How to reset my account password?',
            a: 'Go to Login → “Forgot Password” and follow the instructions to reset via email.',
        },
        {
            q: 'What delivery areas do you cover?',
            a: 'We currently deliver across Vietnam with standard and express options depending on your region.',
        },
        {
            q: 'Can I reorder past medicines quickly?',
            a: 'Yes. Go to “My Orders”, select a past order, and tap “Reorder” to instantly repurchase.',
        },
    ];

    const handleSubmit = () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter your feedback before submitting.');
            return;
        }
        Alert.alert('Thank you 💚', 'Your message has been sent to our support team.');
        setMessage('');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#EAF8FB' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={s.header}>
                    <Ionicons name="help-buoy-outline" size={60} color="#00ADEF" />
                    <Text style={s.title}>PharmaCare Support Center</Text>
                    <Text style={s.subtitle}>How can we help you today?</Text>
                </View>

                {/* Contact Info */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>📞 Contact Us</Text>
                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('mailto:support@pharmacare.vn')}>
                        <Ionicons name="mail-outline" size={22} color="#009688" />
                        <Text style={s.linkText}>support@pharmacare.vn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('tel:+84901234567')}>
                        <Ionicons name="call-outline" size={22} color="#009688" />
                        <Text style={s.linkText}>+84 901 234 567</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('https://www.pharmacare.vn')}>
                        <Ionicons name="globe-outline" size={22} color="#009688" />
                        <Text style={s.linkText}>www.pharmacare.vn</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ Section */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>💡 Frequently Asked Questions</Text>
                    {faqs.map((item, index) => (
                        <View key={index} style={s.faqItem}>
                            <TouchableOpacity
                                style={s.faqHeader}
                                onPress={() => setExpanded(expanded === index ? null : index)}
                            >
                                <Text style={s.faqQuestion}>{item.q}</Text>
                                <Ionicons
                                    name={expanded === index ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color="#6b7280"
                                />
                            </TouchableOpacity>
                            {expanded === index && <Text style={s.faqAnswer}>{item.a}</Text>}
                        </View>
                    ))}
                </View>

                {/* Feedback Section */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>✉️ Send Feedback</Text>
                    <Text style={s.paragraph}>
                        Have an issue, suggestion, or new feature idea? We’d love to hear from you — your feedback
                        helps us improve our service.
                    </Text>
                    <TextInput
                        placeholder="Write your message here..."
                        placeholderTextColor="#94a3b8"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        style={s.input}
                    />
                    <TouchableOpacity style={s.btn} onPress={handleSubmit}>
                        <Ionicons name="send-outline" size={18} color="#fff" />
                        <Text style={s.btnText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                {/* Back Button */}
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={18} color="#00ADEF" />
                    <Text style={s.backText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { padding: 18, paddingBottom: 60 },
    header: { alignItems: 'center', marginTop: 12, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '800', color: '#009688', marginTop: 8 },
    subtitle: { color: '#1F2937', opacity: 0.7, marginTop: 4, fontSize: 14 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#00ADEF', marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    linkText: { color: '#009688', fontSize: 15, fontWeight: '500' },
    paragraph: { color: '#374151', marginBottom: 10, lineHeight: 20, fontSize: 14 },

    // FAQ
    faqItem: {
        borderTopWidth: 1,
        borderColor: '#f3f4f6',
        paddingVertical: 10,
    },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestion: { fontSize: 15, fontWeight: '600', color: '#1F2937', flex: 1, marginRight: 8 },
    faqAnswer: { color: '#4b5563', marginTop: 6, lineHeight: 20, fontSize: 14 },

    // Feedback
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 12,
        textAlignVertical: 'top',
        minHeight: 100,
        marginTop: 8,
        marginBottom: 14,
        fontSize: 14,
    },
    btn: {
        backgroundColor: '#009688',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
    },
    btnText: { color: '#fff', fontWeight: '700' },

    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 6,
    },
    backText: { color: '#00ADEF', fontWeight: '700' },
});
