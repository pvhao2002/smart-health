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

    // iOS date modal state
    const [showDateIOS, setShowDateIOS] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(form.birthDate);

    const handleChange = (k: string, v: any) => setForm(prev => ({...prev, [k]: v}));

    const handleRegister = async () => {
        if (!form.fullName || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all required fields');
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
            Alert.alert('Success', 'Account created successfully!');
            router.replace('/(tabs)/profile');
        } catch (err: any) {
            console.log(err);
            Alert.alert('Registration failed', err?.response?.data?.message || 'Please check your details');
        } finally {
            setLoading(false);
        }
    };

    // ----- iOS Actionsheets for enum pickers -----
    const showActionSheet = (title: string, field: 'gender' | 'activityLevel' | 'goal') => {
        const maps: Record<typeof field, { labels: string[], values: EnumVal[] }> = {
            gender: {
                labels: ['Male', 'Female', 'Other', 'Cancel'],
                values: ['MALE', 'FEMALE', 'OTHER', 'OTHER']
            },
            activityLevel: {
                labels: [
                    'Sedentary (little exercise)',
                    'Light (1–3 days/week)',
                    'Moderate (3–5 days/week)',
                    'Active (6–7 days/week)',
                    'Very Active (physical job)',
                    'Cancel'
                ],
                values: ['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE', 'SEDENTARY']
            },
            goal: {
                labels: ['Lose Weight', 'Gain Muscle', 'Maintain', 'Cancel'],
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
                if (btnIndex === opts.labels.length - 1) return; // cancel
                handleChange(field, opts.values[btnIndex]);
            }
        );
    };

    const renderPickerOrSheet = (label: string, field: 'gender' | 'activityLevel' | 'goal') => {
        if (Platform.OS === 'ios') {
            // iOS: show pressable line that opens ActionSheet
            const displayVal = {
                gender: {MALE: 'Male', FEMALE: 'Female', OTHER: 'Other'} as any,
                activityLevel: {
                    SEDENTARY: 'Sedentary', LIGHT: 'Light', MODERATE: 'Moderate',
                    ACTIVE: 'Active', VERY_ACTIVE: 'Very Active'
                } as any,
                goal: {LOSE_WEIGHT: 'Lose Weight', GAIN_MUSCLE: 'Gain Muscle', MAINTAIN: 'Maintain'} as any
            }[field][form[field] as EnumVal] || 'Select';

            return (
                <Pressable style={s.input} onPress={() => showActionSheet(label, field)}>
                    <Text style={{color: '#1F2937'}}>{displayVal}</Text>
                </Pressable>
            );
        }

        // Android: native Picker
        const itemsMap: Record<typeof field, { label: string, value: EnumVal }[]> = {
            gender: [
                {label: 'Male', value: 'MALE'},
                {label: 'Female', value: 'FEMALE'},
                {label: 'Other', value: 'OTHER'},
            ],
            activityLevel: [
                {label: 'Sedentary (little exercise)', value: 'SEDENTARY'},
                {label: 'Light (1–3 days/week)', value: 'LIGHT'},
                {label: 'Moderate (3–5 days/week)', value: 'MODERATE'},
                {label: 'Active (6–7 days/week)', value: 'ACTIVE'},
                {label: 'Very Active (physical job)', value: 'VERY_ACTIVE'},
            ],
            goal: [
                {label: 'Lose Weight', value: 'LOSE_WEIGHT'},
                {label: 'Gain Muscle', value: 'GAIN_MUSCLE'},
                {label: 'Maintain', value: 'MAINTAIN'},
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

    // ----- iOS Date modal -----
    const openDatePicker = () => {
        if (Platform.OS === 'ios') {
            setTempDate(form.birthDate);
            setShowDateIOS(true);
        } else {
            // Android shows dialog directly through DateTimePicker
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
                <Text style={s.title}>Create Your SmartHealth Account</Text>

                <TextInput style={s.input} placeholder="Full name" placeholderTextColor="#94a3b8"
                           value={form.fullName} onChangeText={v => handleChange('fullName', v)}/>

                <TextInput style={s.input} placeholder="Email" placeholderTextColor="#94a3b8"
                           keyboardType="email-address" autoCapitalize="none"
                           value={form.email} onChangeText={v => handleChange('email', v)}/>

                <TextInput style={s.input} placeholder="Password" placeholderTextColor="#94a3b8"
                           secureTextEntry value={form.password} onChangeText={v => handleChange('password', v)}/>

                {/* Gender */}
                {renderPickerOrSheet('Select gender', 'gender')}

                {/* Birth date */}
                <Pressable style={s.input} onPress={openDatePicker}>
                    <Text style={{color: '#1F2937'}}>
                        {form.birthDate.toISOString().split('T')[0]}
                    </Text>
                </Pressable>

                {/* Height/Weight/Target */}
                <TextInput style={s.input} placeholder="Height (cm)" placeholderTextColor="#94a3b8"
                           keyboardType="numeric" value={form.heightCm}
                           onChangeText={v => handleChange('heightCm', v)}/>
                <TextInput style={s.input} placeholder="Weight (kg)" placeholderTextColor="#94a3b8"
                           keyboardType="numeric" value={form.weightKg}
                           onChangeText={v => handleChange('weightKg', v)}/>
                <TextInput style={s.input} placeholder="Target weight (kg)" placeholderTextColor="#94a3b8"
                           keyboardType="numeric" value={form.targetWeightKg}
                           onChangeText={v => handleChange('targetWeightKg', v)}/>

                {/* Activity level */}
                {renderPickerOrSheet('Select activity level', 'activityLevel')}

                {/* Goal */}
                {renderPickerOrSheet('Select goal', 'goal')}

                <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.btnText}>Create Account</Text>}
                </TouchableOpacity>

                <Text style={s.link}>Already have an account? <Text style={s.linkAccent}>Sign in</Text></Text>
            </ScrollView>

            {/* iOS DATE MODAL (no inline overlap) */}
            {Platform.OS === 'ios' ? (
                <Modal visible={showDateIOS} transparent animationType="slide"
                       onRequestClose={() => setShowDateIOS(false)}>
                    <View style={s.modalBackdrop}>
                        <View style={s.modalSheet}>
                            <View style={s.modalBar}/>
                            <View style={s.modalToolbar}>
                                <TouchableOpacity onPress={() => setShowDateIOS(false)}>
                                    <Text style={s.toolbarBtn}>Cancel</Text>
                                </TouchableOpacity>
                                <Text style={s.toolbarTitle}>Select birth date</Text>
                                <TouchableOpacity onPress={() => {
                                    handleChange('birthDate', tempDate);
                                    setShowDateIOS(false);
                                }}>
                                    <Text style={s.toolbarBtn}>Done</Text>
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

            {/* Android Date dialog (classic) */}
            {Platform.OS === 'android' && showDateIOS && (
                <DateTimePicker
                    value={form.birthDate}
                    mode="date"
                    display="default"
                    onChange={(e, d) => {
                        if (d) handleChange('birthDate', d);
                        // close after choose/cancel
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
        paddingHorizontal: 14, backgroundColor: '#fff', fontSize: 15, color: '#1F2937', marginBottom: 14,
        justifyContent: 'center'
    },
    pickerContainer: {
        borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12,
        backgroundColor: '#fff', marginBottom: 14,
    },
    picker: {height: 50, color: '#1F2937'},

    btn: {
        backgroundColor: '#3EB489', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginTop: 8,
        shadowColor: '#3EB489', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 4}, shadowRadius: 6, elevation: 3,
    },
    btnText: {color: '#fff', fontWeight: '700', fontSize: 16},
    link: {textAlign: 'center', marginTop: 24, fontSize: 14, color: '#1F2937'},
    linkAccent: {color: '#6C63FF', fontWeight: '700'},

    // iOS date modal
    modalBackdrop: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end'
    },
    modalSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 24
    },
    modalBar: {
        width: 50, height: 5, borderRadius: 3, backgroundColor: '#e5e7eb', alignSelf: 'center', marginVertical: 8
    },
    modalToolbar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9'
    },
    toolbarBtn: {color: '#3EB489', fontWeight: '700', fontSize: 16},
    toolbarTitle: {color: '#111827', fontWeight: '700', fontSize: 16},
});
