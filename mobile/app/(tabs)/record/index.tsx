import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "expo-router";
import {APP_CONFIG} from "@/constants/app-config";

export default function HealthHistoryScreen() {
    const {user} = useAuthStore();
    const token = user?.token;
    const router = useRouter();

    /** =========================
     * TAB STATE
     ========================= */
    const [activeTab, setActiveTab] = useState<"health" | "meal">("health");

    /** =========================
     * HEALTH STATE
     ========================= */
    const [records, setRecords] = useState<any[]>([]);
    const [loadingHealth, setLoadingHealth] = useState(true);
    const [refreshingHealth, setRefreshingHealth] = useState(false);

    const [modalHealth, setModalHealth] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [userHeightCm, setUserHeightCm] = useState<number | null>(null);

    const [newRecord, setNewRecord] = useState({
        date: new Date(),
        weight: "",
        bmi: "",
        heartRate: "",
        sleepHours: "",
        steps: "",
        distance: "",
        caloriesBurned: "",
        note: "",
    });

    /** =========================
     * MEAL STATE
     ========================= */
    const [mealLogs, setMealLogs] = useState<any[]>([]);
    const [loadingMeal, setLoadingMeal] = useState(true);
    const [refreshingMeal, setRefreshingMeal] = useState(false);
    const [modalMeal, setModalMeal] = useState(false);

    const [mealList, setMealList] = useState<any[]>([]);
    const [loadingMealsList, setLoadingMealsList] = useState(true);
    const [showMealPicker, setShowMealPicker] = useState(false);
    const [showMealDatePicker, setShowMealDatePicker] = useState(false);

    const [newMeal, setNewMeal] = useState({
        date: new Date(),
        mealId: "",
        mealType: "BREAKFAST",
        quantity: "",
        note: "",
    });

    /** =========================
     * LOAD USER PROFILE → GET HEIGHT
     ========================= */
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const json = await res.json();
                setUserHeightCm(json?.data?.heightCm ?? null);
            } catch (_) {
            }
        };
        loadProfile();
    }, [token]);

    /** =========================
     * FETCH HEALTH RECORD LIST
     ========================= */
    const fetchHealthRecords = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/health-records/my`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            setRecords(json.data ?? json);
        } catch (e: any) {
            Alert.alert("Lỗi", e.message);
        } finally {
            setLoadingHealth(false);
            setRefreshingHealth(false);
        }
    }, [token]);

    /** =========================
     * FETCH MEAL LOG LIST
     ========================= */
    const fetchMealLogs = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/meal-logs/my`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            setMealLogs(json.data ?? json);
        } catch (e: any) {
            Alert.alert("Lỗi", e.message);
        } finally {
            setLoadingMeal(false);
            setRefreshingMeal(false);
        }
    }, [token]);

    /** =========================
     * FETCH MEAL LIST (for dropdown)
     ========================= */
    const fetchMealList = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/admin/meals`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const json = await res.json();
            setMealList(json.data ?? json);
        } catch (e) {
            console.log("fetchMealList error:", e);
        } finally {
            setLoadingMealsList(false);
        }
    }, [token]);

    /** =========================
     * INITIAL LOAD
     ========================= */
    useEffect(() => {
        fetchHealthRecords();
        fetchMealLogs();
        fetchMealList();
    }, [fetchHealthRecords, fetchMealLogs, fetchMealList]);

    /** =========================
     * REFRESH HANDLERS
     ========================= */
    const handleRefreshHealth = () => {
        setRefreshingHealth(true);
        fetchHealthRecords();
    };

    const handleRefreshMeal = () => {
        setRefreshingMeal(true);
        fetchMealLogs();
    };

    /** =========================
     * CALCULATE BMI
     ========================= */
    const calculateBMI = (weight: string) => {
        if (!weight || !userHeightCm) return "";
        const h = userHeightCm / 100;
        return (parseFloat(weight) / (h * h)).toFixed(2);
    };

    /** =========================
     * THÊM BẢN GHI SỨC KHỎE
     ========================= */
    const handleAddRecord = async () => {
        if (!newRecord.weight)
            return Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập cân nặng.");

        try {
            const body = {
                date: newRecord.date.toISOString().split("T")[0],
                weight: parseFloat(newRecord.weight),

                heartRate: newRecord.heartRate ? parseInt(newRecord.heartRate) : null,
                sleepHours: newRecord.sleepHours ? parseFloat(newRecord.sleepHours) : null,

                steps: newRecord.steps ? parseInt(newRecord.steps) : null,
                distance: newRecord.distance ? parseFloat(newRecord.distance) : null,
                caloriesBurned: newRecord.caloriesBurned ? parseInt(newRecord.caloriesBurned) : null,

                note: newRecord.note,
            };

            const res = await fetch(`${APP_CONFIG.BASE_URL}/health-records`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            Alert.alert("✅ Lưu thành công!");

            setModalHealth(false);
            setNewRecord({
                date: new Date(),
                weight: "",
                bmi: "",
                heartRate: "",
                sleepHours: "",
                steps: "",
                distance: "",
                caloriesBurned: "",
                note: "",
            });

            fetchHealthRecords();
        } catch (err: any) {
            Alert.alert("Lỗi", err.message);
        }
    };

    /** =========================
     * THÊM NHẬT KÝ BỮA ĂN
     ========================= */
    const handleAddMeal = async () => {
        if (!newMeal.mealId) {
            return Alert.alert("Thiếu thông tin", "Vui lòng chọn món ăn trước.");
        }

        try {
            const body = {
                date: newMeal.date.toISOString().split("T")[0],
                mealId: Number(newMeal.mealId),
                mealType: newMeal.mealType,
                quantity: newMeal.quantity ? Number(newMeal.quantity) : null,
                note: newMeal.note,
            };

            const res = await fetch(`${APP_CONFIG.BASE_URL}/meal-logs`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            Alert.alert("🍽️ Đã lưu!");

            setModalMeal(false);
            setNewMeal({
                date: new Date(),
                mealId: "",
                mealType: "BREAKFAST",
                quantity: "",
                note: "",
            });

            fetchMealLogs();
        } catch (err: any) {
            Alert.alert("Lỗi", err.message);
        }
    };

    /** =========================
     * RENDER MỘT RECORD SỨC KHỎE
     ========================= */
    const renderRecord = ({item}: { item: any }) => (
        <View style={s.card}>
            <View style={s.cardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#6C63FF"/>
                <Text style={s.date}>
                    {new Date(item.date).toLocaleDateString("vi-VN")}
                </Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="barbell-outline" size={20} color="#3EB489"/>
                <Text style={s.metricText}>Cân nặng: {item.weight} kg</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="body-outline" size={20} color="#FFB74D"/>
                <Text style={s.metricText}>BMI: {item.bmi?.toFixed(2) ?? "—"}</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="heart-outline" size={20} color="#EF4444"/>
                <Text style={s.metricText}>Nhịp tim: {item.heartRate ?? "—"} bpm</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="moon-outline" size={20} color="#6C63FF"/>
                <Text style={s.metricText}>Ngủ: {item.sleepHours ?? "—"} giờ</Text>
            </View>

            {item.steps && (
                <View style={s.metric}>
                    <Ionicons name="walk-outline" size={20} color="#3EB489"/>
                    <Text style={s.metricText}>Số bước: {item.steps}</Text>
                </View>
            )}

            {item.distance && (
                <View style={s.metric}>
                    <Ionicons name="footsteps-outline" size={20} color="#6C63FF"/>
                    <Text style={s.metricText}>Quãng đường: {item.distance} km</Text>
                </View>
            )}

            {item.caloriesBurned && (
                <View style={s.metric}>
                    <Ionicons name="flame-outline" size={20} color="#FF6F61"/>
                    <Text style={s.metricText}>Calo đốt: {item.caloriesBurned}</Text>
                </View>
            )}

            {item.note && <Text style={s.note}>💬 {item.note}</Text>}
        </View>
    );

    /** =========================
     * RENDER MỘT NHẬT KÝ BỮA ĂN
     ========================= */
    const renderMeal = ({item}: { item: any }) => (
        <View style={s.mealCard}>
            {/* Header */}
            <View style={s.mealHeader}>
                <View style={s.mealHeaderLeft}>
                    <Ionicons name="fast-food-outline" size={20} color="#F59E0B"/>
                    <Text style={s.mealDate}>
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                    </Text>
                </View>

                <View style={s.mealTypeBadge}>
                    <Text style={s.mealTypeText}>{item.mealType}</Text>
                </View>
            </View>

            {/* Meal Name */}
            <Text style={s.mealName}>{item.mealName}</Text>

            {/* Stats */}
            <View style={s.mealStatsRow}>
                <View style={s.mealStatItem}>
                    <Ionicons name="list-outline" size={16} color="#6B7280"/>
                    <Text style={s.mealStatText}>Số lượng: {item.quantity ?? "—"}</Text>
                </View>

                <View style={s.mealStatItem}>
                    <Ionicons name="flame-outline" size={16} color="#EF4444"/>
                    <Text style={s.mealStatText}>
                        {item.totalCalories ?? "—"} kcal
                    </Text>
                </View>
            </View>

            {item.note && <Text style={s.mealNote}>💬 {item.note}</Text>}
        </View>
    );

    /** LẤY TÊN MÓN ĐƯỢC CHỌN */
    const selectedMealName = useMemo(() => {
        if (!newMeal.mealId) return "";
        const found = mealList.find(m => m.id == newMeal.mealId);
        return found?.name ?? "";
    }, [mealList, newMeal.mealId]);

    return (
        <>
            <View style={s.container}>

                {/* HEADER */}
                <View style={s.header}>
                    <Ionicons name="pulse-outline" size={28} color="#3EB489"/>
                    <Text style={s.headerTitle}>Lịch sử ghi nhận</Text>
                </View>

                {/* TABS */}
                <View style={s.tabs}>
                    <TouchableOpacity
                        style={[s.tabItem, activeTab === "health" && s.tabActive]}
                        onPress={() => setActiveTab("health")}
                    >
                        <Text style={[s.tabText, activeTab === "health" && s.tabTextActive]}>
                            Sức khỏe
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[s.tabItem, activeTab === "meal" && s.tabActive]}
                        onPress={() => setActiveTab("meal")}
                    >
                        <Text style={[s.tabText, activeTab === "meal" && s.tabTextActive]}>
                            Bữa ăn
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* NỘI DUNG TAB SỨC KHỎE */}
                {activeTab === "health" ? (
                    loadingHealth ? (
                        <View style={s.center}>
                            <ActivityIndicator size="large" color="#6C63FF"/>
                        </View>
                    ) : (
                        <FlatList
                            data={records}
                            renderItem={renderRecord}
                            keyExtractor={(item) => item.id?.toString?.() ?? Math.random().toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshingHealth}
                                    onRefresh={handleRefreshHealth}
                                    tintColor="#3EB489"
                                    colors={["#3EB489"]}
                                />
                            }
                            ListEmptyComponent={
                                <View
                                    style={{flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100}}>
                                    <Ionicons name="fitness-outline" size={60} color="#D1D5DB"/>
                                    <Text style={{marginTop: 14, fontSize: 16, color: "#9CA3AF"}}>
                                        Chưa có dữ liệu. Kéo xuống để tải lại.
                                    </Text>
                                </View>
                            }
                            contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}
                        />
                    )
                ) : (
                    /* NỘI DUNG TAB BỮA ĂN */
                    loadingMeal ? (
                        <View style={s.center}>
                            <ActivityIndicator size="large" color="#FF9800"/>
                        </View>
                    ) : (
                        <FlatList
                            data={mealLogs}
                            renderItem={renderMeal}
                            keyExtractor={(item) => item.id?.toString?.() ?? Math.random().toString()}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshingMeal}
                                    onRefresh={handleRefreshMeal}
                                    tintColor="#FF9800"
                                    colors={["#FF9800"]}
                                />
                            }
                            ListEmptyComponent={
                                <View
                                    style={{flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100}}>
                                    <Ionicons name="fast-food-outline" size={60} color="#D1D5DB"/>
                                    <Text style={{marginTop: 14, fontSize: 16, color: "#9CA3AF"}}>
                                        Chưa có dữ liệu. Kéo xuống để tải lại.
                                    </Text>
                                </View>
                            }
                            contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}
                        />
                    )
                )}

                {/* NÚT THÊM */}
                {activeTab === "health" ? (
                    <TouchableOpacity style={s.fabHealth} onPress={() => setModalHealth(true)}>
                        <Ionicons name="add" size={32} color="#fff"/>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={s.fabMeal} onPress={() => setModalMeal(true)}>
                        <Ionicons name="add" size={32} color="#fff"/>
                    </TouchableOpacity>
                )}

                {/* MODAL THÊM SỨC KHỎE */}
                <Modal visible={modalHealth} animationType="slide" transparent>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{flex: 1}}
                    >
                        <View style={s.modalOverlay}>
                            <View style={s.modalBox}>

                                <Text style={s.modalTitle}>Thêm ghi nhận trong ngày</Text>

                                {/* Chọn ngày */}
                                <TouchableOpacity style={s.input} onPress={() => setShowDatePicker(true)}>
                                    <Ionicons name="calendar-outline" size={19} color="#6C63FF"/>
                                    <Text style={s.inputText}>
                                        {newRecord.date.toISOString().split("T")[0]}
                                    </Text>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={newRecord.date}
                                        mode="date"
                                        onChange={(e, selected) => {
                                            setShowDatePicker(false);
                                            if (selected) setNewRecord({...newRecord, date: selected});
                                        }}
                                    />
                                )}

                                {/* Cân nặng */}
                                <View style={s.input}>
                                    <Ionicons name="barbell-outline" size={19} color="#3EB489"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Cân nặng (kg)"
                                        keyboardType="numeric"
                                        value={newRecord.weight}
                                        onChangeText={(v) => setNewRecord({
                                            ...newRecord,
                                            weight: v,
                                            bmi: calculateBMI(v)
                                        })}
                                    />
                                </View>

                                {/* Nhịp tim */}
                                <View style={s.input}>
                                    <Ionicons name="heart-outline" size={19} color="#EF4444"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Nhịp tim (bpm)"
                                        keyboardType="numeric"
                                        value={newRecord.heartRate}
                                        onChangeText={(v) => setNewRecord({...newRecord, heartRate: v})}
                                    />
                                </View>

                                {/* Giờ ngủ */}
                                <View style={s.input}>
                                    <Ionicons name="moon-outline" size={19} color="#6C63FF"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Số giờ ngủ"
                                        keyboardType="numeric"
                                        value={newRecord.sleepHours}
                                        onChangeText={(v) => setNewRecord({...newRecord, sleepHours: v})}
                                    />
                                </View>

                                {/* Bước chân */}
                                <View style={s.input}>
                                    <Ionicons name="walk-outline" size={19} color="#3EB489"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Số bước"
                                        keyboardType="numeric"
                                        value={newRecord.steps}
                                        onChangeText={(v) => setNewRecord({...newRecord, steps: v})}
                                    />
                                </View>

                                {/* Quãng đường */}
                                <View style={s.input}>
                                    <Ionicons name="footsteps-outline" size={19} color="#6C63FF"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Quãng đường (km)"
                                        keyboardType="numeric"
                                        value={newRecord.distance}
                                        onChangeText={(v) => setNewRecord({...newRecord, distance: v})}
                                    />
                                </View>

                                {/* Calo đốt */}
                                <View style={s.input}>
                                    <Ionicons name="flame-outline" size={19} color="#FF6F61"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Calo đốt"
                                        keyboardType="numeric"
                                        value={newRecord.caloriesBurned}
                                        onChangeText={(v) => setNewRecord({...newRecord, caloriesBurned: v})}
                                    />
                                </View>

                                {/* Ghi chú */}
                                <View style={[s.input, {height: 90}]}>
                                    <Ionicons name="create-outline" size={19} color="#FFB74D"/>
                                    <TextInput
                                        style={[s.inputText, {height: 80, textAlignVertical: "top"}]}
                                        placeholder="Ghi chú..."
                                        multiline
                                        value={newRecord.note}
                                        onChangeText={(v) => setNewRecord({...newRecord, note: v})}
                                    />
                                </View>

                                <View style={s.modalActions}>
                                    <TouchableOpacity style={s.cancelBtn} onPress={() => setModalHealth(false)}>
                                        <Text style={s.cancelText}>Hủy</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={s.saveBtn} onPress={handleAddRecord}>
                                        <Text style={s.saveText}>Lưu</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                {/* MODAL THÊM BỮA ĂN */}
                <Modal visible={modalMeal} animationType="slide" transparent>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{flex: 1}}
                    >
                        <View style={s.modalOverlay}>
                            <View style={s.modalBox}>

                                <Text style={s.modalTitle}>Thêm nhật ký bữa ăn</Text>

                                {/* Ngày ăn */}
                                <TouchableOpacity style={s.input} onPress={() => setShowMealDatePicker(true)}>
                                    <Ionicons name="calendar-outline" size={19} color="#FF9800"/>
                                    <Text style={s.inputText}>
                                        {newMeal.date.toISOString().split("T")[0]}
                                    </Text>
                                </TouchableOpacity>

                                {showMealDatePicker && (
                                    <DateTimePicker
                                        value={newMeal.date}
                                        mode="date"
                                        onChange={(e, selected) => {
                                            setShowMealDatePicker(false);
                                            if (selected) setNewMeal({...newMeal, date: selected});
                                        }}
                                    />
                                )}

                                {/* Chọn món */}
                                <View style={s.formGroup}>
                                    <Text style={s.label}>Chọn món</Text>

                                    <TouchableOpacity
                                        style={s.selectBox}
                                        onPress={() => {
                                            setModalMeal(false);
                                            setTimeout(() => setShowMealPicker(true), 50);
                                        }}
                                    >
                                        <View style={s.selectRow}>
                                            <Text style={[s.selectText, !selectedMealName && s.placeholderText]}>
                                                {selectedMealName || "Chọn món"}
                                            </Text>

                                            <Ionicons name="chevron-down" size={20} color="#9CA3AF"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Số lượng */}
                                <View style={s.input}>
                                    <Ionicons name="list-outline" size={19} color="#FF9800"/>
                                    <TextInput
                                        style={s.inputText}
                                        placeholder="Số lượng"
                                        keyboardType="numeric"
                                        value={newMeal.quantity}
                                        onChangeText={(v) => setNewMeal({...newMeal, quantity: v})}
                                    />
                                </View>

                                {/* Loại bữa ăn */}
                                <View style={s.formGroup}>
                                    <Text style={s.label}>Loại bữa</Text>

                                    <View style={s.chipRow}>
                                        {[
                                            {key: "BREAKFAST", label: "Sáng"},
                                            {key: "LUNCH", label: "Trưa"},
                                            {key: "DINNER", label: "Tối"},
                                            {key: "SNACK", label: "Ăn nhẹ"},
                                        ].map((type) => {
                                            const isActive = newMeal.mealType === type.key;
                                            return (
                                                <TouchableOpacity
                                                    key={type.key}
                                                    style={[s.chip, isActive && s.chipActive]}
                                                    onPress={() => setNewMeal(prev => ({...prev, mealType: type.key}))}
                                                >
                                                    <Text style={[s.chipText, isActive && s.chipTextActive]}>
                                                        {type.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Ghi chú */}
                                <View style={[s.input, {height: 90}]}>
                                    <Ionicons name="create-outline" size={19} color="#FFB74D"/>
                                    <TextInput
                                        style={[s.inputText, {height: 80, textAlignVertical: "top"}]}
                                        placeholder="Ghi chú..."
                                        multiline
                                        value={newMeal.note}
                                        onChangeText={(v) => setNewMeal({...newMeal, note: v})}
                                    />
                                </View>

                                <View style={s.modalActions}>
                                    <TouchableOpacity style={s.cancelBtn} onPress={() => setModalMeal(false)}>
                                        <Text style={s.cancelText}>Hủy</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={s.saveBtnMeal} onPress={handleAddMeal}>
                                        <Text style={s.saveText}>Lưu</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

            </View>

            {/* MODAL CHỌN MÓN ĂN – đặt ngoài container */}
            <Modal visible={showMealPicker} transparent animationType="fade">
                <View style={s.pickerOverlay}>
                    <View className="pickerBoxModern" style={s.pickerBoxModern}>

                        {/* Header */}
                        <View style={s.pickerHeader}>
                            <Text style={s.pickerTitle}>Chọn món ăn</Text>

                            <TouchableOpacity onPress={() => setShowMealPicker(false)}>
                                <Ionicons name="close" size={24} color="#6B7280"/>
                            </TouchableOpacity>
                        </View>

                        {/* Danh sách món */}
                        <FlatList
                            data={mealList}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingBottom: 12}}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={s.mealItemModern}
                                    onPress={() => {
                                        setNewMeal({...newMeal, mealId: item.id.toString()});
                                        setShowMealPicker(false);
                                        setTimeout(() => setModalMeal(true), 50);
                                    }}
                                >
                                    <View>
                                        <Text style={s.mealNameModern}>{item.name}</Text>
                                        <Text style={s.mealCalModern}>{item.calories} kcal</Text>
                                    </View>

                                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF"/>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}

/* =========================
   STYLES
========================= */
const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingHorizontal: 16,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 14,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1F2937",
    },

    /* ----------- TABS ----------- */
    tabs: {
        flexDirection: "row",
        backgroundColor: "#E5E7EB",
        padding: 5,
        borderRadius: 12,
        marginBottom: 12,
        gap: 6,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    tabText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6B7280",
    },
    tabActive: {
        backgroundColor: "#3EB489",
    },
    tabTextActive: {
        color: "#fff",
    },

    /* ----------- CARDS ----------- */
    card: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
    },
    date: {
        fontSize: 15,
        fontWeight: "700",
        color: "#374151",
    },

    metric: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 4,
    },
    metricText: {
        color: "#374151",
        fontSize: 15,
    },

    note: {
        marginTop: 6,
        fontStyle: "italic",
        color: "#6B7280",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    /* ----------- FAB ----------- */
    fabHealth: {
        position: "absolute",
        bottom: 90,
        right: 25,
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#FFB74D",
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        zIndex: 999,
    },

    fabMeal: {
        position: "absolute",
        bottom: 90,
        right: 25,
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#FF9800",
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        zIndex: 999,
    },

    /* ----------- MODALS ----------- */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalBox: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
    },

    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    inputText: {
        flex: 1,
        fontSize: 15,
        color: "#1F2937",
    },

    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 10,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    cancelText: {
        color: "#6B7280",
        fontWeight: "600",
    },
    saveBtn: {
        backgroundColor: "#3EB489",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    saveBtnMeal: {
        backgroundColor: "#FF9800",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    saveText: {
        color: "#fff",
        fontWeight: "700",
    },

    mealSelectBox: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        padding: 12,
        alignSelf: "stretch",
    },

    pickerOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 9999,
        elevation: 9999,
    },

    pickerBox: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        maxHeight: "70%",
    },

    mealItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    mealCal: {
        fontSize: 14,
        color: "#666",
    },

    pickerBoxModern: {
        width: "90%",
        backgroundColor: "#ffffff",
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        maxHeight: "75%",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        transform: [{scale: 1}],
    },

    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
    },

    pickerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },

    mealItemModern: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#F3F4F6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    mealNameModern: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },

    mealCalModern: {
        fontSize: 13,
        color: "#6B7280",
        marginTop: 3,
    },

    /* ---------- MEAL CARD NEW UI ---------- */
    mealCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    mealHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    mealHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    mealDate: {
        fontSize: 15,
        fontWeight: "600",
        color: "#374151",
    },

    mealTypeBadge: {
        backgroundColor: "#FEF3C7",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },

    mealTypeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#D97706",
        textTransform: "capitalize",
    },

    mealName: {
        marginTop: 8,
        fontSize: 17,
        fontWeight: "700",
        color: "#1F2937",
    },

    mealStatsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 18,
    },

    mealStatItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    mealStatText: {
        fontSize: 14,
        color: "#4B5563",
    },

    mealNote: {
        marginTop: 10,
        fontStyle: "italic",
        color: "#6B7280",
        fontSize: 14,
    },

    /* ----------- FORM GROUP ----------- */
    formGroup: {
        width: "100%",
        marginBottom: 12,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 6,
    },

    /* ----------- SELECT BOX ----------- */
    selectBox: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },

    selectRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectText: {
        fontSize: 15,
        color: "#1F2937",
        flex: 1,
    },

    placeholderText: {
        color: "#9CA3AF",
    },

    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },

    chip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#F9FAFB",
    },

    chipActive: {
        backgroundColor: "#FFEDD5",
        borderColor: "#FB923C",
    },

    chipText: {
        fontSize: 13,
        color: "#4B5563",
    },

    chipTextActive: {
        color: "#C2410C",
        fontWeight: "600",
    },
});

