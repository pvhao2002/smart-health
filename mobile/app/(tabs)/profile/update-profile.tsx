import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useAuthStore} from "@/store/authStore";
import {APP_CONFIG} from "@/constants/app-config";
import {useRouter} from "expo-router";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UpdateProfileScreen() {
    const router = useRouter();
    const {user} = useAuthStore();
    const token = user?.token;

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        age: "",
        birthDate: "",
        heightCm: "",
        weightKg: "",
        targetWeightKg: "",
        goal: "MAINTAIN",
        activityLevel: "SEDENTARY",
    });

    // Tải thông tin hồ sơ
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                const json = await res.json();
                if (!res.ok) throw new Error(json.message);

                const p = json.data ?? json;

                setForm({
                    fullName: p.fullName || "",
                    age: p.age?.toString() || "",
                    birthDate: p.birthDate || "",
                    heightCm: p.heightCm?.toString() || "",
                    weightKg: p.weightKg?.toString() || "",
                    targetWeightKg: p.targetWeightKg?.toString() || "",
                    goal: p.goal || "MAINTAIN",
                    activityLevel: p.activityLevel || "SEDENTARY",
                });
            } catch (e: any) {
                Alert.alert("Lỗi", e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                fullName: form.fullName,
                age: parseInt(form.age) || null,
                birthDate: form.birthDate || null,
                heightCm: form.heightCm ? Number(form.heightCm) : null,
                weightKg: form.weightKg ? Number(form.weightKg) : null,
                targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : null,
                goal: form.goal,
                activityLevel: form.activityLevel,
            };

            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!', [
                {
                    text: 'OK',
                    onPress: () => router.push('/profile?refresh=1'),
                },
            ]);
        } catch (e: any) {
            Alert.alert("Lỗi", e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={s.loadingWrap}>
                <ActivityIndicator size="large" color="#3EB489"/>
                <Text style={s.loadingText}>Đang tải hồ sơ…</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: "#F9FAFB"}}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={s.container}>
                <Text style={s.title}>Cập nhật hồ sơ</Text>
                <Text style={s.subtitle}>Giữ thông tin sức khỏe của bạn luôn chính xác 💚</Text>

                {/* THÔNG TIN */}
                <View style={s.card}>
                    <LabelInput
                        icon="person-outline"
                        placeholder="Họ và tên"
                        value={form.fullName}
                        onChange={(fullName: string) => setForm({...form, fullName})}
                    />

                    {/* Ngày sinh */}
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.8}
                    >
                        <View style={s.inputBox}>
                            <Ionicons name="calendar-outline" size={20} color="#3EB489" style={s.icon}/>

                            <Text style={[s.input, {paddingTop: 10}]}>
                                {form.birthDate ? form.birthDate : "Ngày sinh (yyyy-MM-dd)"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={form.birthDate ? new Date(form.birthDate) : new Date()}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    const yyyy = selectedDate.getFullYear();
                                    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
                                    const dd = String(selectedDate.getDate()).padStart(2, "0");
                                    const formatted = `${yyyy}-${mm}-${dd}`;

                                    setForm({...form, birthDate: formatted});
                                }
                            }}
                        />
                    )}

                    <LabelInput
                        icon="fitness-outline"
                        placeholder="Tuổi"
                        keyboard="number-pad"
                        value={form.age}
                        onChange={(age: string) => setForm({...form, age})}
                    />

                    <LabelInput
                        icon="barcode-outline"
                        placeholder="Chiều cao (cm)"
                        keyboard="number-pad"
                        value={form.heightCm}
                        onChange={(heightCm: string) => setForm({...form, heightCm})}
                    />

                    <LabelInput
                        icon="barbell-outline"
                        placeholder="Cân nặng (kg)"
                        keyboard="number-pad"
                        value={form.weightKg}
                        onChange={(weightKg: string) => setForm({...form, weightKg})}
                    />

                    <LabelInput
                        icon="flag-outline"
                        placeholder="Cân nặng mục tiêu (kg)"
                        keyboard="number-pad"
                        value={form.targetWeightKg}
                        onChange={(targetWeightKg: string) => setForm({...form, targetWeightKg})}
                    />

                    {/* MỨC ĐỘ HOẠT ĐỘNG */}
                    <View style={s.pickerBox}>
                        <Text style={s.pickerLabel}>Mức độ hoạt động</Text>
                        <Picker
                            selectedValue={form.activityLevel}
                            onValueChange={(v) => setForm({...form, activityLevel: v})}
                        >
                            <Picker.Item label="Ít vận động" value="SEDENTARY"/>
                            <Picker.Item label="Nhẹ nhàng" value="LIGHT"/>
                            <Picker.Item label="Trung bình" value="MODERATE"/>
                            <Picker.Item label="Năng động" value="ACTIVE"/>
                            <Picker.Item label="Rất năng động" value="VERY_ACTIVE"/>
                        </Picker>
                    </View>

                    {/* MỤC TIÊU */}
                    <View style={s.pickerBox}>
                        <Text style={s.pickerLabel}>Mục tiêu</Text>
                        <Picker
                            selectedValue={form.goal}
                            onValueChange={(v) => setForm({...form, goal: v})}
                        >
                            <Picker.Item label="Giữ cân" value="MAINTAIN"/>
                            <Picker.Item label="Giảm cân" value="LOSE_WEIGHT"/>
                            <Picker.Item label="Tăng cơ" value="GAIN_MUSCLE"/>
                        </Picker>
                    </View>

                    {/* LƯU */}
                    <TouchableOpacity
                        style={s.saveBtn}
                        disabled={saving}
                        onPress={handleSave}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff"/>
                        ) : (
                            <>
                                <Ionicons name="save-outline" size={20} color="#fff"/>
                                <Text style={s.saveText}>Lưu thay đổi</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

/* Component Input chung */
function LabelInput({icon, value, placeholder, onChange, keyboard}: any) {
    return (
        <View style={s.inputBox}>
            <Ionicons name={icon} size={20} color="#3EB489" style={{marginRight: 8}}/>
            <TextInput
                style={s.input}
                placeholder={placeholder}
                value={value}
                keyboardType={keyboard}
                onChangeText={onChange}
            />
        </View>
    );
}

/* STYLES */
const s = StyleSheet.create({
    container: {padding: 20, paddingBottom: 60},
    title: {fontSize: 22, fontWeight: "800", color: "#3EB489", textAlign: "center"},
    subtitle: {color: "#6b7280", textAlign: "center", marginBottom: 20},

    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    inputBox: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#d1d5db",
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 14,
        alignItems: "center",
    },

    input: {flex: 1, fontSize: 15},

    pickerBox: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: "#F9FAFB",
    },
    pickerLabel: {
        fontSize: 14,
        color: "#374151",
        marginTop: 8,
        marginLeft: 10,
        fontWeight: "600",
    },

    saveBtn: {
        backgroundColor: "#3EB489",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 30,
        marginTop: 10,
        gap: 8,
    },
    saveText: {color: "#fff", fontWeight: "700", fontSize: 16},

    loadingWrap: {flex: 1, justifyContent: "center", alignItems: "center"},
    loadingText: {marginTop: 10, color: "#6b7280"},

    icon: {marginRight: 8},
});
