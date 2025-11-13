import React, {useState} from 'react';
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
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';

export default function SupportScreen() {
    const router = useRouter();
    const [expanded, setExpanded] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const faqs = [
        {
            q: 'How do I track my daily health metrics?',
            a: 'Go to the Activity tab → You can monitor calories burned, steps, workout history, and more.',
        },
        {
            q: 'Can SmartHealth generate personalized meal plans?',
            a: 'Yes! Based on your BMI, goals and dietary preferences, SmartHealth recommends daily meal plans.',
        },
        {
            q: 'Is my health information secure?',
            a: 'All your data is encrypted and securely stored following industry best practices.',
        },
        {
            q: 'How do I edit my profile?',
            a: 'Open the Profile tab → Edit Profile to update your goals, weight, height, or activity level.',
        },
        {
            q: 'Can I connect SmartHealth with smartwatches?',
            a: 'SmartHealth supports Apple Health, Google Fit and other devices via synced data.',
        },
    ];

    const handleSubmit = () => {
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter your feedback before submitting.');
            return;
        }
        Alert.alert('Thank you 💚', 'Your message has been sent to the SmartHealth support team.');
        setMessage('');
    };

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#F9FAFB'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={s.header}>
                    <Ionicons name="chatbubble-ellipses-outline" size={60} color="#3EB489"/>
                    <Text style={s.title}>SmartHealth Support</Text>
                    <Text style={s.subtitle}>We’re here to help you stay healthy 💚</Text>
                </View>

                {/* Contact Info */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>📞 Contact Us</Text>

                    <TouchableOpacity
                        style={s.row}
                        onPress={() => Linking.openURL('mailto:support@smarthealth.vn')}
                    >
                        <Ionicons name="mail-outline" size={22} color="#6C63FF"/>
                        <Text style={s.linkText}>support@smarthealth.vn</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={s.row} onPress={() => Linking.openURL('tel:+84901234567')}>
                        <Ionicons name="call-outline" size={22} color="#6C63FF"/>
                        <Text style={s.linkText}>+84 901 234 567</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={s.row}
                        onPress={() => Linking.openURL('https://www.smarthealth.vn')}
                    >
                        <Ionicons name="globe-outline" size={22} color="#6C63FF"/>
                        <Text style={s.linkText}>www.smarthealth.vn</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ */}
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
                            {expanded === index && (
                                <Text style={s.faqAnswer}>{item.a}</Text>
                            )}
                        </View>
                    ))}
                </View>

                {/* Feedback */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>✉️ Send Feedback</Text>
                    <Text style={s.paragraph}>
                        Have an issue, suggestion, or idea?
                        Your feedback helps us improve SmartHealth every day!
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
                        <Ionicons name="send-outline" size={18} color="#fff"/>
                        <Text style={s.btnText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                {/* Back Button */}
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={18} color="#3EB489"/>
                    <Text style={s.backText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: {padding: 18, paddingBottom: 60},
    header: {alignItems: 'center', marginTop: 12, marginBottom: 20},
    title: {fontSize: 22, fontWeight: '800', color: '#3EB489', marginTop: 8},
    subtitle: {color: '#374151', opacity: 0.7, marginTop: 4, fontSize: 14},

    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#6C63FF',
        marginBottom: 10,
    },

    row: {flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10},
    linkText: {color: '#3EB489', fontSize: 15, fontWeight: '600'},
    paragraph: {color: '#374151', marginBottom: 10, lineHeight: 20, fontSize: 14},

    faqItem: {
        borderTopWidth: 1,
        borderColor: '#f1f5f9',
        paddingVertical: 10,
    },
    faqHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    faqQuestion: {fontSize: 15, fontWeight: '600', color: '#1F2937', flex: 1, marginRight: 8},
    faqAnswer: {color: '#4b5563', marginTop: 6, lineHeight: 20, fontSize: 14},

    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 14,
        marginTop: 8,
        marginBottom: 14,
    },

    btn: {
        backgroundColor: '#3EB489',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#3EB489',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    btnText: {color: '#fff', fontWeight: '700', fontSize: 15},

    backBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    backText: {color: '#3EB489', fontWeight: '700'},
});
