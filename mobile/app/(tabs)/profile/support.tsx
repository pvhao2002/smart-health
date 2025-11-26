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
            q: 'Làm sao để theo dõi chỉ số sức khỏe hằng ngày?',
            a: 'Vào tab Hoạt Động → bạn có thể xem lượng calo đốt cháy, số bước đi, lịch sử tập luyện và nhiều hơn.',
        },
        {
            q: 'SmartHealth có tạo thực đơn cá nhân hoá không?',
            a: 'Có! Dựa trên BMI, mục tiêu và khẩu phần ăn của bạn, SmartHealth sẽ đề xuất thực đơn mỗi ngày.',
        },
        {
            q: 'Thông tin sức khỏe của tôi có được bảo mật không?',
            a: 'Tất cả dữ liệu của bạn được mã hóa và lưu trữ an toàn theo tiêu chuẩn bảo mật hiện đại.',
        },
        {
            q: 'Làm sao để chỉnh sửa hồ sơ?',
            a: 'Mở tab Hồ Sơ → chọn Chỉnh sửa hồ sơ để cập nhật mục tiêu, cân nặng, chiều cao hoặc mức độ hoạt động.',
        },
        {
            q: 'SmartHealth có hỗ trợ kết nối đồng hồ thông minh không?',
            a: 'SmartHealth hỗ trợ Apple Health, Google Fit và nhiều thiết bị đồng bộ khác.',
        },
    ];

    const handleSubmit = () => {
        if (!message.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập nội dung trước khi gửi.');
            return;
        }
        Alert.alert('Cảm ơn bạn 💚', 'Phản hồi của bạn đã được gửi đến đội ngũ SmartHealth.');
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
                    <Text style={s.title}>Hỗ Trợ SmartHealth</Text>
                    <Text style={s.subtitle}>Chúng tôi luôn sẵn sàng hỗ trợ bạn 💚</Text>
                </View>

                {/* Contact Info */}
                <View style={s.card}>
                    <Text style={s.sectionTitle}>📞 Liên hệ</Text>

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
                    <Text style={s.sectionTitle}>💡 Câu hỏi thường gặp</Text>

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
                    <Text style={s.sectionTitle}>✉️ Gửi phản hồi</Text>
                    <Text style={s.paragraph}>
                        Bạn gặp vấn đề, có góp ý hoặc ý tưởng mới?
                        Hãy gửi cho chúng tôi — phản hồi của bạn giúp SmartHealth phát triển tốt hơn!
                    </Text>

                    <TextInput
                        placeholder="Viết tin nhắn của bạn..."
                        placeholderTextColor="#94a3b8"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        style={s.input}
                    />

                    <TouchableOpacity style={s.btn} onPress={handleSubmit}>
                        <Ionicons name="send-outline" size={18} color="#fff"/>
                        <Text style={s.btnText}>Gửi</Text>
                    </TouchableOpacity>
                </View>

                {/* Back Button */}
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={18} color="#3EB489"/>
                    <Text style={s.backText}>Quay lại</Text>
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
