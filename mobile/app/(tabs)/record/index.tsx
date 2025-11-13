import React, {useEffect, useState, useCallback} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform
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
    const [mealList, setMealList] = useState<any[]>([]);
    const [loadingMealsList, setLoadingMealsList] = useState(true);


    const [newRecord, setNewRecord] = useState({
        date: new Date(),
        weight: "",
        bmi: "",
        heartRate: "",
        sleepHours: "",
        note: "",
    });

    /** =========================
     * MEAL STATE
     ========================= */
    const [mealLogs, setMealLogs] = useState<any[]>([]);
    const [loadingMeal, setLoadingMeal] = useState(true);
    const [refreshingMeal, setRefreshingMeal] = useState(false);
    const [modalMeal, setModalMeal] = useState(false);
    const [showMealPicker, setShowMealPicker] = useState(false);

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
            Alert.alert("Error", e.message);
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
            Alert.alert("Error", e.message);
        } finally {
            setLoadingMeal(false);
            setRefreshingMeal(false);
        }
    }, [token]);

    useEffect(() => {
        fetchHealthRecords();
        fetchMealLogs();
        fetchMealList();
    }, []);

    const fetchMealList = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/admin/meals`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const json = await res.json();
            setMealList(json);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingMealsList(false);
        }
    }, [token]);

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
     * ADD HEALTH RECORD
     ========================= */
    const handleAddRecord = async () => {
        if (!newRecord.weight)
            return Alert.alert("⚠️ Missing", "Please enter your weight");

        try {
            const body = {
                date: newRecord.date.toISOString().split("T")[0],
                weight: parseFloat(newRecord.weight),
                heartRate: newRecord.heartRate ? parseInt(newRecord.heartRate) : null,
                sleepHours: newRecord.sleepHours ? parseFloat(newRecord.sleepHours) : null,
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

            Alert.alert("✅ Saved!");

            setModalHealth(false);
            setNewRecord({date: new Date(), weight: "", bmi: "", heartRate: "", sleepHours: "", note: ""});

            fetchHealthRecords();
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    /** =========================
     * ADD MEAL LOG
     ========================= */
    const handleAddMeal = async () => {
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

            setModalMeal(false);
            setNewMeal({date: new Date(), mealId: "", mealType: "BREAKFAST", quantity: "", note: ""});

            fetchMealLogs();
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    /** =========================
     * RENDER ITEMS
     ========================= */
    const renderRecord = ({item}: { item: any }) => (
        <View style={s.card}>
            <View style={s.cardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#6C63FF"/>
                <Text style={s.date}>{new Date(item.date).toLocaleDateString("vi-VN")}</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="barbell-outline" size={20} color="#3EB489"/>
                <Text style={s.metricText}>Weight: {item.weight} kg</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="body-outline" size={20} color="#FFB74D"/>
                <Text style={s.metricText}>BMI: {item.bmi?.toFixed(2) ?? "—"}</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="heart-outline" size={20} color="#EF4444"/>
                <Text style={s.metricText}>Heart Rate: {item.heartRate ?? "—"} bpm</Text>
            </View>

            <View style={s.metric}>
                <Ionicons name="moon-outline" size={20} color="#6C63FF"/>
                <Text style={s.metricText}>Sleep: {item.sleepHours ?? "—"} h</Text>
            </View>

            {item.note && <Text style={s.note}>💬 {item.note}</Text>}
        </View>
    );

    const renderMeal = ({item}: { item: any }) => (
        <View style={s.card}>
            <Text style={s.date}>{item.date}</Text>
            <Text style={s.metricText}>{item.mealType} - {item.mealName}</Text>
            <Text style={s.metricText}>Qty: {item.quantity}</Text>
            <Text style={s.metricText}>Calories: {item.totalCalories} kcal</Text>
            {item.note && <Text style={s.note}>💬 {item.note}</Text>}
        </View>
    );

    return (
        <View style={s.container}>

            {/* HEADER */}
            <View style={s.header}>
                <Ionicons name="pulse-outline" size={28} color="#3EB489"/>
                <Text style={s.headerTitle}>Records</Text>
            </View>

            {/* TOP TABS */}
            <View style={s.tabs}>
                <TouchableOpacity
                    style={[s.tabItem, activeTab === "health" && s.tabActive]}
                    onPress={() => setActiveTab("health")}
                >
                    <Text style={[s.tabText, activeTab === "health" && s.tabTextActive]}>
                        Health
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[s.tabItem, activeTab === "meal" && s.tabActive]}
                    onPress={() => setActiveTab("meal")}
                >
                    <Text style={[s.tabText, activeTab === "meal" && s.tabTextActive]}>
                        Meals
                    </Text>
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
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
                            <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100}}>
                                <Ionicons name="fitness-outline" size={60} color="#D1D5DB"/>
                                <Text style={{marginTop: 14, fontSize: 16, color: "#9CA3AF"}}>
                                    No records yet. Pull to refresh.
                                </Text>
                            </View>
                        }
                        contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}
                    />
                )
            ) : (
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
                            <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 100}}>
                                <Ionicons name="fast-food-outline" size={60} color="#D1D5DB"/>
                                <Text style={{marginTop: 14, fontSize: 16, color: "#9CA3AF"}}>
                                    No meal logs yet. Pull to refresh.
                                </Text>
                            </View>
                        }
                        contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}
                    />
                )
            )}

            {/* FAB */}
            {activeTab === "health" ? (
                <TouchableOpacity style={s.fabHealth} onPress={() => setModalHealth(true)}>
                    <Ionicons name="add" size={32} color="#fff"/>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={s.fabMeal} onPress={() => setModalMeal(true)}>
                    <Ionicons name="add" size={32} color="#fff"/>
                </TouchableOpacity>
            )}

            {/* MODAL ADD HEALTH */}
            <Modal visible={modalHealth} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex: 1}}
                >
                    <View style={s.modalOverlay}>
                        <View style={s.modalBox}>
                            <Text style={s.modalTitle}>Add Daily Record</Text>

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

                            <View style={s.input}>
                                <Ionicons name="barbell-outline" size={19} color="#3EB489"/>
                                <TextInput
                                    style={s.inputText}
                                    placeholder="Weight (kg)"
                                    keyboardType="numeric"
                                    value={newRecord.weight}
                                    onChangeText={(v) =>
                                        setNewRecord({...newRecord, weight: v, bmi: calculateBMI(v)})
                                    }
                                />
                            </View>

                            <View style={s.input}>
                                <Ionicons name="heart-outline" size={19} color="#EF4444"/>
                                <TextInput
                                    style={s.inputText}
                                    placeholder="Heart Rate (bpm)"
                                    keyboardType="numeric"
                                    value={newRecord.heartRate}
                                    onChangeText={(v) => setNewRecord({...newRecord, heartRate: v})}
                                />
                            </View>

                            <View style={s.input}>
                                <Ionicons name="moon-outline" size={19} color="#6C63FF"/>
                                <TextInput
                                    style={s.inputText}
                                    placeholder="Sleep Hours"
                                    keyboardType="numeric"
                                    value={newRecord.sleepHours}
                                    onChangeText={(v) => setNewRecord({...newRecord, sleepHours: v})}
                                />
                            </View>

                            <View style={[s.input, {height: 90}]}>
                                <Ionicons name="create-outline" size={19} color="#FFB74D"/>
                                <TextInput
                                    style={[s.inputText, {height: 80, textAlignVertical: "top"}]}
                                    placeholder="Notes..."
                                    multiline
                                    value={newRecord.note}
                                    onChangeText={(v) => setNewRecord({...newRecord, note: v})}
                                />
                            </View>

                            <View style={s.modalActions}>
                                <TouchableOpacity style={s.cancelBtn} onPress={() => setModalHealth(false)}>
                                    <Text style={s.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={s.saveBtn} onPress={handleAddRecord}>
                                    <Text style={s.saveText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* MODAL ADD MEAL */}
            <Modal visible={modalMeal} animationType="slide" transparent>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex: 1}}
                >
                    <View style={s.modalOverlay}>
                        <View style={s.modalBox}>
                            <Text style={s.modalTitle}>Add Meal Log</Text>

                            <TouchableOpacity style={s.input} onPress={() => setShowDatePicker(true)}>
                                <Ionicons name="calendar-outline" size={19} color="#FF9800"/>
                                <Text style={s.inputText}>
                                    {newMeal.date.toISOString().split("T")[0]}
                                </Text>
                            </TouchableOpacity>

                            <View style={[s.input, {flexDirection: "column", alignItems: "flex-start"}]}>
                                <Text style={{fontWeight: "600", marginBottom: 6}}>Select Meal</Text>

                                {loadingMealsList ? (
                                    <ActivityIndicator size="small" color="#FF9800"/>
                                ) : (
                                    <TouchableOpacity
                                        style={s.mealSelectBox}
                                        onPress={() => setShowMealPicker(true)}
                                    >
                                        <Text style={s.inputText}>
                                            {newMeal.mealId
                                                ? mealList.find(m => m.id === Number(newMeal.mealId))?.name
                                                : "Choose a meal..."}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={s.input}>
                                <Ionicons name="list-outline" size={19} color="#FF9800"/>
                                <TextInput
                                    style={s.inputText}
                                    placeholder="Quantity"
                                    keyboardType="numeric"
                                    value={newMeal.quantity}
                                    onChangeText={(v) => setNewMeal({...newMeal, quantity: v})}
                                />
                            </View>

                            <View style={[s.input, {height: 90}]}>
                                <Ionicons name="create-outline" size={19} color="#FFB74D"/>
                                <TextInput
                                    style={[s.inputText, {height: 80, textAlignVertical: "top"}]}
                                    placeholder="Notes..."
                                    multiline
                                    value={newMeal.note}
                                    onChangeText={(v) => setNewMeal({...newMeal, note: v})}
                                />
                            </View>

                            <View style={s.modalActions}>
                                <TouchableOpacity style={s.cancelBtn} onPress={() => setModalMeal(false)}>
                                    <Text style={s.cancelText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={s.saveBtnMeal} onPress={handleAddMeal}>
                                    <Text style={s.saveText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal visible={showMealPicker} transparent animationType="fade">
                <View style={s.pickerOverlay}>
                    <View style={s.pickerBox}>
                        <Text style={s.modalTitle}>Choose a meal</Text>

                        <FlatList
                            data={mealList}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={s.mealItem}
                                    onPress={() => {
                                        setNewMeal({...newMeal, mealId: item.id.toString()});
                                        setShowMealPicker(false);
                                    }}
                                >
                                    <Text style={s.mealName}>{item.name}</Text>
                                    <Text style={s.mealCal}>{item.calories} kcal</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity onPress={() => setShowMealPicker(false)}>
                            <Text style={s.cancelText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>
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
        alignSelf: "stretch"
    },

    pickerOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },

    pickerBox: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        maxHeight: "70%"
    },

    mealItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },

    mealName: {
        fontSize: 16,
        fontWeight: "600"
    },

    mealCal: {
        fontSize: 14,
        color: "#666"
    }
});
