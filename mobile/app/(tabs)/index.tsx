import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator, RefreshControl,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {APP_CONFIG} from "@/constants/app-config";
import {useAuthStore} from "@/store/authStore";
import {useLocalSearchParams} from "expo-router";

interface HealthRecordResponse {
    id: number;
    date: string;
    weight: number | null;
    bmi: number | null;
    heartRate: number | null;
    sleepHours: number | null;
    steps: number | null;
    distance: number | null;
    caloriesBurned: number | null;
    note: string | null;
    createdAt: string;
}

interface WorkoutTypeDTO {
    id: number;
    name: string;
    caloriesPerMinute: number;
    description: string;
    url: string;
    level: string;
    goal: string;
    isActive: boolean;
    ytbUrl: string;
}

interface MealDTO {
    id: number;
    name: string;
    url: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface HomeUserDTO {
    yesterdaysHealthRecord: HealthRecordResponse | null;
    todayHealthRecord: HealthRecordResponse | null;
    weeklyHealthRecords: HealthRecordResponse[];
    recommendedWorkouts: WorkoutTypeDTO[];
    recommendedMeals: MealDTO[];
}

export default function SmartHealthHome() {
    const {user} = useAuthStore();
    const token = user?.token;

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [home, setHome] = useState<HomeUserDTO>({
        yesterdaysHealthRecord: null,
        todayHealthRecord: null,
        weeklyHealthRecords: [],
        recommendedWorkouts: [],
        recommendedMeals: [],
    });

    useEffect(() => {
        loadHomeData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHomeData();
        setRefreshing(false);
    };

    const loadHomeData = async () => {
        try {
            setLoading(true);

            const requests = [
                fetch(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.PROFILE}`, {
                    headers: {Authorization: `Bearer ${token}`}
                }),
                fetch(`${APP_CONFIG.BASE_URL}/users/my`, {
                    headers: {Authorization: `Bearer ${token}`}
                }),
            ];

            const [profileRes, homeRes] = await Promise.all(requests);
            const [profileJson, homeJson] = await Promise.all([
                profileRes.json(),
                homeRes.json()
            ]);

            if (!profileRes.ok) throw new Error(profileJson.message);
            if (!homeRes.ok) throw new Error(homeJson.message);

            setProfile(profileJson.data ?? profileJson);
            setHome(homeJson.data ?? homeJson);

        } catch (err) {
            console.log("Home error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Format ngày
    const formatDay = (dateStr: string) => {
        const days: any = {
            Mon: "T2", Tue: "T3", Wed: "T4",
            Thu: "T5", Fri: "T6", Sat: "T7", Sun: "CN"
        };
        const d = new Date(dateStr);
        const en = d.toLocaleDateString("en-US", {weekday: "short"});
        return days[en] ?? en;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.getDate();
    };

    const today = new Date();
    const todayRec = home.todayHealthRecord;

    if (loading)
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="large" color="#3EB489"/>
            </View>
        );

    return (
        <ScrollView
            style={s.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 140}}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#3EB489"]}
                    tintColor="#3EB489"
                />
            }
        >
            {/* HEADER */}
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>Xin chào,</Text>
                    <Text style={s.username}>{profile?.fullName ?? "Người dùng"} 🌿</Text>
                    <Text style={s.date}>
                        {today.toLocaleDateString("vi-VN")}
                    </Text>
                </View>

                <TouchableOpacity style={s.avatarBtn}>
                    <Image
                        source={require("@/assets/images/avatar.jpg")}
                        style={s.avatar}
                    />
                </TouchableOpacity>
            </View>

            {/* RINGS */}
            <View style={s.activityContainer}>
                <View style={s.activityRing}>
                    <LinearGradient colors={["#FF6F61", "#FFB74D"]} style={s.ring1}/>
                    <LinearGradient colors={["#3EB489", "#6C63FF"]} style={s.ring2}/>
                    <LinearGradient colors={["#6C63FF", "#3EB489"]} style={s.ring3}/>

                    <View style={s.ringCenter}>
                        <Text style={s.ringNumber}>
                            {todayRec?.steps ?? 0}
                        </Text>
                        <Text style={s.ringLabel}>bước</Text>
                    </View>
                </View>
            </View>

            {/* QUICK STATS */}
            <View style={s.statsRow}>
                <View style={[s.statCard, {backgroundColor: "#EAFBF6"}]}>
                    <Ionicons name="flame-outline" size={22} color="#3EB489"/>
                    <Text style={s.statValue}>{todayRec?.caloriesBurned ?? 0}</Text>
                    <Text style={s.statLabel}>Calo</Text>
                </View>

                <View style={[s.statCard, {backgroundColor: "#EDEAFF"}]}>
                    <Ionicons name="barbell-outline" size={22} color="#6C63FF"/>
                    <Text style={s.statValue}>
                        {home.recommendedWorkouts.length}
                    </Text>
                    <Text style={s.statLabel}>Bài tập</Text>
                </View>

                <View style={[s.statCard, {backgroundColor: "#FFF5E6"}]}>
                    <Ionicons name="water-outline" size={22} color="#FFB74D"/>
                    <Text style={s.statValue}>
                        {(todayRec?.sleepHours ?? 0).toFixed(1)}h
                    </Text>
                    <Text style={s.statLabel}>Giấc ngủ</Text>
                </View>
            </View>

            {/* DAILY SUMMARY */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>📊 Tổng quan hôm nay</Text>

                <View style={s.summaryCard}>

                    <View style={s.summaryRow}>
                        <Ionicons name="walk-outline" size={22} color="#3EB489"/>
                        <Text style={s.summaryLabel}>Bước chân</Text>
                        <Text style={s.summaryValue}>{todayRec?.steps ?? 0}</Text>
                    </View>

                    <View style={s.summaryRow}>
                        <Ionicons name="map-outline" size={22} color="#6C63FF"/>
                        <Text style={s.summaryLabel}>Quãng đường</Text>
                        <Text style={s.summaryValue}>
                            {(todayRec?.distance ?? 0) + " km"}
                        </Text>
                    </View>

                    <View style={s.summaryRow}>
                        <Ionicons name="flame-outline" size={22} color="#FF6F61"/>
                        <Text style={s.summaryLabel}>Calo đã đốt</Text>
                        <Text style={s.summaryValue}>
                            {(todayRec?.caloriesBurned ?? 0) + " kcal"}
                        </Text>
                    </View>

                    <View style={s.summaryRow}>
                        <Ionicons name="moon-outline" size={22} color="#6C63FF"/>
                        <Text style={s.summaryLabel}>Giấc ngủ</Text>
                        <Text style={s.summaryValue}>
                            {(todayRec?.sleepHours ?? 0) + " h"}
                        </Text>
                    </View>

                    <View style={s.summaryRow}>
                        <Ionicons name="heart-outline" size={22} color="#EF4444"/>
                        <Text style={s.summaryLabel}>Nhịp tim</Text>
                        <Text style={s.summaryValue}>
                            {(todayRec?.heartRate ?? "-") + " bpm"}
                        </Text>
                    </View>

                    <View style={s.summaryRow}>
                        <Ionicons name="barbell-outline" size={22} color="#3EB489"/>
                        <Text style={s.summaryLabel}>Cân nặng</Text>
                        <Text style={s.summaryValue}>
                            {(todayRec?.weight ?? "-") + " kg"}
                        </Text>
                    </View>

                    <View style={s.summaryRow}>
                        <Ionicons name="body-outline" size={22} color="#FFB74D"/>
                        <Text style={s.summaryLabel}>BMI</Text>
                        <Text style={s.summaryValue}>
                            {(todayRec?.bmi ?? "-")}
                        </Text>
                    </View>
                </View>
            </View>

            {/* RECOMMENDED WORKOUTS */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>🏋️ Gợi ý bài tập</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {home.recommendedWorkouts.map((w, idx) => (
                        <TouchableOpacity key={idx} style={s.workoutCard} activeOpacity={0.8}>
                            <Image
                                source={require("@/assets/images/workout-sample.jpg")}
                                style={s.workoutImage}
                            />
                            <Text style={s.workoutName}>{w.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* TODAY’S MENU */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>🥗 Thực đơn hôm nay</Text>

                {home.recommendedMeals.length === 0 ? (
                    <Text style={{color: "#6B7280"}}>Chưa có món ăn gợi ý.</Text>
                ) : (
                    <View style={s.dietCard}>
                        <Image
                            source={require("@/assets/images/salad.jpg")}
                            style={s.dietImg}
                        />
                        <View style={{flex: 1, marginLeft: 12}}>
                            <Text style={s.dietTitle}>{home.recommendedMeals[0].name}</Text>
                            <Text style={s.dietDesc}>
                                {home.recommendedMeals[0].calories} kcal
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF"/>
                    </View>
                )}
            </View>

            {/* WEEKLY TREND */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>📆 Xu hướng trong tuần</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {home.weeklyHealthRecords.map((r, idx) => (
                        <View key={idx} style={s.weekBox}>

                            <Text style={s.weekDay}>{formatDay(r.date)}</Text>
                            <Text style={s.weekDate}>{formatDate(r.date)}</Text>

                            <View style={s.weekMetricRow}>
                                <Ionicons name="walk-outline" size={16} color="#3EB489"/>
                                <Text style={s.weekMetric}>{r.steps ?? 0}</Text>
                            </View>

                            <View style={s.weekMetricRow}>
                                <Ionicons name="map-outline" size={16} color="#6C63FF"/>
                                <Text style={s.weekMetric}>{r.distance ?? 0} km</Text>
                            </View>

                            <View style={s.weekMetricRow}>
                                <Ionicons name="flame-outline" size={16} color="#FF6F61"/>
                                <Text style={s.weekMetric}>{r.caloriesBurned ?? 0} kcal</Text>
                            </View>

                            <View style={s.weekMetricRow}>
                                <Ionicons name="moon-outline" size={16} color="#FFB74D"/>
                                <Text style={s.weekMetric}>{r.sleepHours ?? 0} h</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* MOTIVATION */}
            <View style={s.tipBox}>
                <Ionicons name="heart-outline" size={24} color="#3EB489"/>
                <Text style={s.tipText}>
                    💡 “Tiến bộ dù nhỏ vẫn là tiến bộ. Cứ tiếp tục nhé!”
                </Text>
            </View>
        </ScrollView>
    );
}

/* ===================== STYLES ===================== */

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#F9FAFB", padding: 16},

    header: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    greeting: {fontSize: 18, color: "#6B7280"},
    username: {fontSize: 26, fontWeight: "800", color: "#1F2937"},
    date: {color: "#9CA3AF", marginTop: 4},

    avatarBtn: {padding: 4, borderRadius: 50, backgroundColor: "#E5E7EB"},
    avatar: {width: 46, height: 46, borderRadius: 23},

    /* RINGS */
    activityContainer: {alignItems: "center", marginBottom: 30},
    activityRing: {
        width: 200, height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    ring1: {
        position: "absolute",
        width: 200, height: 200, borderRadius: 100,
    },
    ring2: {position: "absolute", width: 160, height: 160, borderRadius: 80},
    ring3: {position: "absolute", width: 120, height: 120, borderRadius: 60},
    ringCenter: {
        backgroundColor: "#fff",
        width: 90, height: 90, borderRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    ringNumber: {fontSize: 30, fontWeight: "800", color: "#1F2937"},
    ringLabel: {fontSize: 13, color: "#6B7280"},

    /* Quick stats */
    statsRow: {flexDirection: "row", justifyContent: "space-between", marginBottom: 24},
    statCard: {
        width: "31%",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
    },
    statValue: {fontSize: 18, fontWeight: "700", color: "#1F2937", marginTop: 4},
    statLabel: {color: "#6B7280", fontSize: 13},

    /* Sections */
    section: {marginBottom: 26},
    sectionTitle: {fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 10},

    summaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },
    summaryLabel: {fontSize: 15, color: "#374151"},
    summaryValue: {fontSize: 15, fontWeight: "700", color: "#111827"},

    workoutCard: {
        marginRight: 12,
        borderRadius: 16,
        overflow: "hidden",
        width: 140,
        backgroundColor: "#fff",
        elevation: 2,
    },
    workoutImage: {width: "100%", height: 90},
    workoutName: {padding: 8, fontWeight: "600", color: "#1F2937"},

    dietCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        elevation: 2,
    },
    dietImg: {width: 60, height: 60, borderRadius: 12},
    dietTitle: {fontWeight: "700", color: "#1F2937"},
    dietDesc: {fontSize: 13, color: "#6B7280", marginTop: 4},

    weekValue: {marginTop: 4, color: "#6B7280"},

    tipBox: {
        flexDirection: "row",
        backgroundColor: "#EAFBF6",
        padding: 14,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 20,
    },
    tipText: {flex: 1, marginLeft: 8, color: "#1F2937", lineHeight: 18},
    weekBox: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 16,
        marginRight: 12,
        width: 110,
        alignItems: "center",
        elevation: 2,
    },

    weekDay: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },

    weekDate: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 10,
    },

    weekMetricRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    weekMetric: {
        marginLeft: 6,
        fontSize: 14,
        color: "#374151",
    },
});
