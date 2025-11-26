import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            {/* Header */}
            <View style={s.header}>
                <Image
                    source={{uri: 'https://cdn-icons-png.flaticon.com/512/2966/2966483.png'}}
                    style={s.logo}
                />
                <Text style={s.title}>SmartHealth 🌿</Text>
                <Text style={s.subtitle}>
                    Theo dõi • Cải thiện • Sống khoẻ hơn mỗi ngày
                </Text>
            </View>

            {/* About Section */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>💡 SmartHealth là gì?</Text>
                <Text style={s.paragraph}>
                    SmartHealth là trợ lý sức khoẻ cá nhân tất cả-trong-một, giúp bạn ghi lại bài tập,
                    theo dõi bước chân, đếm calo, cải thiện thói quen sống, đồng thời cung cấp các gợi ý
                    tập luyện & dinh dưỡng phù hợp với mục tiêu của bạn.
                </Text>

                <View style={s.list}>
                    <Text style={s.item}>• Ghi lại bài tập, bước chân và lượng calo đốt cháy</Text>
                    <Text style={s.item}>• Theo dõi tiến trình hằng ngày, hằng tuần và hằng tháng</Text>
                    <Text style={s.item}>• Gợi ý bài tập cá nhân hoá</Text>
                    <Text style={s.item}>• Lập thực đơn thông minh dựa trên BMI và mục tiêu</Text>
                    <Text style={s.item}>• Biểu đồ trực quan cho hành trình sức khoẻ của bạn</Text>
                </View>
            </View>

            {/* Tech Stack */}
            <View style={s.card}>
                <Text style={s.sectionTitle}>🧬 Công nghệ được sử dụng</Text>

                <View style={s.stackList}>
                    <View style={s.stackItem}>
                        <Ionicons name="logo-react" size={22} color="#6C63FF"/>
                        <Text style={s.stackText}>React Native (Expo SDK 54)</Text>
                    </View>

                    <View style={s.stackItem}>
                        <Ionicons name="leaf-outline" size={22} color="#3EB489"/>
                        <Text style={s.stackText}>Spring Boot API</Text>
                    </View>

                    <View style={s.stackItem}>
                        <Ionicons name="server-outline" size={22} color="#FFB74D"/>
                        <Text style={s.stackText}>Cơ sở dữ liệu MySQL</Text>
                    </View>

                    <View style={s.stackItem}>
                        <Ionicons name="lock-closed-outline" size={22} color="#6C63FF"/>
                        <Text style={s.stackText}>Xác thực bảo mật JWT</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F9FAFB'},
    content: {padding: 20, paddingBottom: 60},

    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    logo: {width: 90, height: 90, marginBottom: 10},
    title: {fontSize: 26, fontWeight: '800', color: '#3EB489', textAlign: 'center'},
    subtitle: {color: '#4B5563', textAlign: 'center', marginTop: 6, fontSize: 14},

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    sectionTitle: {fontSize: 18, fontWeight: '700', color: '#3EB489', marginBottom: 10},
    paragraph: {color: '#374151', fontSize: 15, lineHeight: 22, marginBottom: 8},

    list: {marginTop: 6},
    item: {color: '#4B5563', marginBottom: 6, fontSize: 14},

    stackList: {marginTop: 10},
    stackItem: {flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10},
    stackText: {color: '#1F2937', fontSize: 15, fontWeight: '500'},

    footer: {alignItems: 'center', marginTop: 10},
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6C63FF',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#6C63FF',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    btnText: {color: '#fff', fontWeight: '700'},
    version: {color: '#6b7280', fontSize: 13, marginTop: 8},
});
