'use client';
import React, {useState} from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform, ScrollView, Modal, Pressable, ActionSheetIOS
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {APP_CONFIG, ENV} from '@/constants/app-config';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';

type EnumVal =
    'MALE'
    | 'FEMALE'
    | 'OTHER'
    | 'SEDENTARY'
    | 'LIGHT'
    | 'MODERATE'
    | 'ACTIVE'
    | 'VERY_ACTIVE'
    | 'LOSE_WEIGHT'
    | 'GAIN_MUSCLE'
    | 'MAINTAIN';

export default function RegisterScreen() {
    const router = useRouter();
    const loginStore = useAuthStore(s => s.login);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        gender: 'MALE' as EnumVal,
        birthDate: new Date(),
        heightCm: '',
        weightKg: '',
        activityLevel: 'SEDENTARY' as EnumVal,
        goal: 'MAINTAIN' as EnumVal,
        targetWeightKg: '',
    });

    const [loading, setLoading] = useState(false);
    const [showDateIOS, setShowDateIOS] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(form.birthDate);

    const handleChange = (k: string, v: any) => setForm(prev => ({...prev, [k]: v}));

    const handleRegister = async () => {
        if (!form.fullName || !form.email || !form.password) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.');
            return;
        }
        try {
            setLoading(true);
            const param = {
                ...form,
                heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
                weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
                targetWeightKg: form.targetWeightKg ? parseFloat(form.targetWeightKg) : null,
                birthDate: form.birthDate.toISOString().split('T')[0],
            };

            const res = await axios.post(`${ENV.BASE_URL}${APP_CONFIG.API.AUTH.REGISTER}`, param);
            loginStore(res.data);
            Alert.alert('Thành công', 'Tạo tài khoản thành công!');
            router.replace('/(tabs)/profile');

        } catch (err: any) {
            console.log(err);
            Alert.alert(
                'Đăng ký thất bại',
                err?.response?.data?.message || 'Vui lòng kiểm tra lại thông tin'
            );
        } finally {
            setLoading(false);
        }
    };

    // ===== IOS ACTIONSHEET (giới tính, hoạt động, mục tiêu) =====
    const showActionSheet = (title: string, field: 'gender' | 'activityLevel' | 'goal') => {
        const maps: Record<typeof field, { labels: string[], values: EnumVal[] }> = {
            gender: {
                labels: ['Nam', 'Nữ', 'Khác', 'Hủy'],
                values: ['MALE', 'FEMALE', 'OTHER', 'OTHER']
            },
            activityLevel: {
                labels: [
                    'Ít vận động',
                    'Nhẹ (1–3 buổi/tuần)',
                    'Vừa (3–5 buổi/tuần)',
                    'Năng động (6–7 buổi/tuần)',
                    'Rất năng động (công việc tay chân)',
                    'Hủy'
                ],
                values: ['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE', 'SEDENTARY']
            },
            goal: {
                labels: ['Giảm cân', 'Tăng cơ', 'Duy trì', 'Hủy'],
                values: ['LOSE_WEIGHT', 'GAIN_MUSCLE', 'MAINTAIN', 'MAINTAIN']
            }
        };

        const opts = maps[field];
        ActionSheetIOS.showActionSheetWithOptions(
            {
                title,
                options: opts.labels,
                cancelButtonIndex: opts.labels.length - 1,
                userInterfaceStyle: 'light'
            },
            (btnIndex) => {
                if (btnIndex === opts.labels.length - 1) return;
                handleChange(field, opts.values[btnIndex]);
            }
        );
    };

    const renderPickerOrSheet = (label: string, field: 'gender' | 'activityLevel' | 'goal') => {
        if (Platform.OS === 'ios') {
            const displayVal = {
                gender: {MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác'} as any,
                activityLevel: {
                    SEDENTARY: 'Ít vận động', LIGHT: 'Nhẹ', MODERATE: 'Vừa',
                    ACTIVE: 'Năng động', VERY_ACTIVE: 'Rất năng động'
                } as any,
                goal: {LOSE_WEIGHT: 'Giảm cân', GAIN_MUSCLE: 'Tăng cơ', MAINTAIN: 'Duy trì'} as any
            }[field][form[field] as EnumVal];

            return (
                <Pressable style={s.input} onPress={() => showActionSheet(label, field)}>
                    <Text style={{color: '#1F2937'}}>{displayVal}</Text>
                </Pressable>
            );
        }

        // ===== Android native Picker =====
        const itemsMap: Record<typeof field, { label: string, value: EnumVal }[]> = {
            gender: [
                {label: 'Nam', value: 'MALE'},
                {label: 'Nữ', value: 'FEMALE'},
                {label: 'Khác', value: 'OTHER'},
            ],
            activityLevel: [
                {label: 'Ít vận động', value: 'SEDENTARY'},
                {label: 'Nhẹ (1–3 buổi/tuần)', value: 'LIGHT'},
                {label: 'Vừa (3–5 buổi/tuần)', value: 'MODERATE'},
                {label: 'Năng động (6–7 buổi/tuần)', value: 'ACTIVE'},
                {label: 'Rất năng động (công việc tay chân)', value: 'VERY_ACTIVE'},
            ],
            goal: [
                {label: 'Giảm cân', value: 'LOSE_WEIGHT'},
                {label: 'Tăng cơ', value: 'GAIN_MUSCLE'},
                {label: 'Duy trì', value: 'MAINTAIN'},
            ]
        };

        return (
            <View style={s.pickerContainer}>
                <Picker
                    selectedValue={form[field]}
                    onValueChange={(v) => handleChange(field, v as EnumVal)}
                    style={s.picker}>
                    {itemsMap[field].map(opt => (
                        <Picker.Item key={opt.value} label={opt.label} value={opt.value}/>
                    ))}
                </Picker>
            </View>
        );
    };

    // ===== iOS date modal =====
    const openDatePicker = () => {
        if (Platform.OS === 'ios') {
            setTempDate(form.birthDate);
            setShowDateIOS(true);
        } else {
            setShowDateIOS(true);
        }
    };

    return (
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#F9FAFB'}}
                              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={[s.container, {paddingBottom: 40}]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <Text style={s.title}>Tạo tài khoản SmartHealth</Text>

                <TextInput style={s.input} placeholder="Họ và tên" placeholderTextColor="#94a3b8"
                           value={form.fullName} onChangeText={v => handleChange('fullName', v)}/>

                <TextInput style={s.input} placeholder="Email" placeholderTextColor="#94a3b8"
                           keyboardType="email-address" autoCapitalize="none"
                           value={form.email} onChangeText={v => handleChange('email', v)}/>

                <TextInput style={s.input} placeholder="Mật khẩu" placeholderTextColor="#94a3b8"
                           secureTextEntry value={form.password} onChangeText={v => handleChange('password', v)}/>

                {/* Gender */}
                {renderPickerOrSheet('Chọn giới tính', 'gender')}

                {/* Birth date */}
                <Pressable style={s.input} onPress={openDatePicker}>
                    <Text style={{color: '#1F2937'}}>
                        {form.birthDate.toISOString().split('T')[0]}
                    </Text>
                </Pressable>

                {/* Height / Weight */}
                <TextInput style={s.input} placeholder="Chiều cao (cm)" placeholderTextColor="#94a3b8"
                           keyboardType="numeric" value={form.heightCm}
                           onChangeText={v => handleChange('heightCm', v)}/>
                <TextInput style={s.input} placeholder="Cân nặng (kg)" placeholderTextColor="#94a3b8"
                           keyboardType="numeric" value={form.weightKg}
                           onChangeText={v => handleChange('weightKg', v)}/>
                <TextInput style={s.input} placeholder="Cân nặng mục tiêu (kg)" placeholderTextColor="#94a3b8"
                           keyboardType="numeric" value={form.targetWeightKg}
                           onChangeText={v => handleChange('targetWeightKg', v)}/>

                {/* Activity */}
                {renderPickerOrSheet('Mức độ vận động', 'activityLevel')}

                {/* Goal */}
                {renderPickerOrSheet('Mục tiêu tập luyện', 'goal')}

                <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff"/> :
                        <Text style={s.btnText}>Tạo tài khoản</Text>}
                </TouchableOpacity>
            </ScrollView>

            {/* ===== iOS DATE PICKER SHEET ===== */}
            {Platform.OS === 'ios' ? (
                <Modal visible={showDateIOS} transparent animationType="slide"
                       onRequestClose={() => setShowDateIOS(false)}>
                    <View style={s.modalBackdrop}>
                        <View style={s.modalSheet}>
                            <View style={s.modalBar}/>
                            <View style={s.modalToolbar}>
                                <TouchableOpacity onPress={() => setShowDateIOS(false)}>
                                    <Text style={s.toolbarBtn}>Hủy</Text>
                                </TouchableOpacity>
                                <Text style={s.toolbarTitle}>Chọn ngày sinh</Text>
                                <TouchableOpacity onPress={() => {
                                    handleChange('birthDate', tempDate);
                                    setShowDateIOS(false);
                                }}>
                                    <Text style={s.toolbarBtn}>Xong</Text>
                                </TouchableOpacity>
                            </View>

                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                onChange={(_, d) => d && setTempDate(d)}
                                style={{backgroundColor: '#fff'}}
                            />
                        </View>
                    </View>
                </Modal>
            ) : null}

            {/* ===== Android date picker ===== */}
            {Platform.OS === 'android' && showDateIOS && (
                <DateTimePicker
                    value={form.birthDate}
                    mode="date"
                    display="default"
                    onChange={(e, d) => {
                        if (d) handleChange('birthDate', d);
                        setShowDateIOS(false);
                    }}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: {flexGrow: 1, padding: 28, backgroundColor: '#F9FAFB'},
    title: {fontSize: 24, fontWeight: '800', textAlign: 'center', marginVertical: 20, color: '#1F2937'},

    input: {
        height: 50, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12,
        paddingHorizontal: 14, backgroundColor: '#fff', fontSize: 15, color: '#1F2937',
        marginBottom: 14, justifyContent: 'center'
    },

    pickerContainer: {
        borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12,
        backgroundColor: '#fff', marginBottom: 14,
    },
    picker: {height: 50, color: '#1F2937'},

    btn: {
        backgroundColor: '#3EB489', paddingVertical: 14, borderRadius: 30,
        alignItems: 'center', marginTop: 8,
        shadowColor: '#3EB489', shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 4}, shadowRadius: 6, elevation: 3,
    },
    btnText: {color: '#fff', fontWeight: '700', fontSize: 16},

    link: {textAlign: 'center', marginTop: 24, fontSize: 14, color: '#1F2937'},
    linkAccent: {color: '#6C63FF', fontWeight: '700'},

    modalBackdrop: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end'
    },
    modalSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 16,
        borderTopRightRadius: 16, paddingBottom: 24
    },
    modalBar: {
        width: 50, height: 5, borderRadius: 3, backgroundColor: '#e5e7eb',
        alignSelf: 'center', marginVertical: 8
    },
    modalToolbar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    toolbarBtn: {color: '#3EB489', fontWeight: '700', fontSize: 16},
    toolbarTitle: {color: '#111827', fontWeight: '700', fontSize: 16},
});
