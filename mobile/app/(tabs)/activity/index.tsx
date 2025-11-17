import React, { useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/store/authStore";
import { APP_CONFIG } from "@/constants/app-config";

type HealthRecord = {
    date: string;
    steps?: number;
    distance?: number;
    caloriesBurned?: number;
    sleepHours?: number;
    heartRate?: number;
    weight?: number;
    bmi?: number;
};

export default function ActivityScreen() {
    const { user } = useAuthStore();
    const token = user?.token;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    /** =========================
     * LOAD ACTIVITY DATA
     ========================= */
    const loadActivity = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const json = await res.json();
            setData(json.data ?? json);
        } catch (e) {
            console.log("Activity load error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActivity();
    }, []);

    /** =========================
     * HOOKS – Must stay BEFORE any return
     ========================= */
    const today: HealthRecord | null = data?.todayHealthRecord ?? null;
    const weeklyRaw: HealthRecord[] = data?.weeklyHealthRecords ?? [];

    const weekly = useMemo(() => {
        if (!weeklyRaw || !Array.isArray(weeklyRaw)) return [];
        return [...weeklyRaw].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [weeklyRaw]);

    const todaySteps = today?.steps ?? 0;

    const maxSteps =
        weekly.length > 0
            ? Math.max(...weekly.map((w) => w.steps ?? 0), 1)
            : Math.max(todaySteps, 1);

    const stepsGoal = 10000; // mục tiêu 10k bước

    const getDayLabel = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    };

    const getHeatColor = (steps?: number) => {
        const ratio = (steps ?? 0) / stepsGoal;

        if (ratio >= 1) return "#22c55e"; // excellent
        if (ratio >= 0.7) return "#4ade80"; // active
        if (ratio >= 0.4) return "#a3e635"; // medium
        if (ratio > 0) return "#facc15"; // low
        return "#e5e7eb"; // rest
    };

    /** =========================
     * SHOW LOADING
     ========================= */
    if (loading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color="#6C63FF" />
            </View>
        );
    }

    /** =========================
     * UI CONTENT
     ========================= */
    return (
        <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 80 }}>
            <Text style={s.header}>Today&#39;s Activity</Text>

            {/* ===== RINGS ===== */}
            <View style={s.ringContainer}>
                <View style={s.ringWrapper}>
                    <LinearGradient colors={["#FF6F61", "#FFB74D"]} style={s.ring1} />
                    <LinearGradient colors={["#3EB489", "#6C63FF"]} style={s.ring2} />
                    <LinearGradient colors={["#6C63FF", "#3EB489"]} style={s.ring3} />

                    <View style={s.ringCenter}>
                        <Text style={s.ringNumber}>{todaySteps}</Text>
                        <Text style={s.ringLabel}>steps</Text>
                    </View>
                </View>
            </View>

            {/* ===== QUICK STATS ===== */}
            <Text style={s.sectionTitle}>Quick Stats</Text>
            <View style={s.statsRow}>
                <View style={s.statCard}>
                    <Ionicons name="walk-outline" size={26} color="#3EB489" />
                    <Text style={s.statValue}>{today?.distance ?? 0} km</Text>
                    <Text style={s.statLabel}>Distance</Text>
                </View>

                <View style={s.statCard}>
                    <Ionicons name="flame-outline" size={26} color="#FF6F61" />
                    <Text style={s.statValue}>{today?.caloriesBurned ?? 0}</Text>
                    <Text style={s.statLabel}>Calories</Text>
                </View>

                <View style={s.statCard}>
                    <Ionicons name="moon-outline" size={26} color="#6C63FF" />
                    <Text style={s.statValue}>{today?.sleepHours ?? 0}h</Text>
                    <Text style={s.statLabel}>Sleep</Text>
                </View>

                <View style={s.statCard}>
                    <Ionicons name="heart-outline" size={26} color="#EF4444" />
                    <Text style={s.statValue}>{today?.heartRate ?? "--"}</Text>
                    <Text style={s.statLabel}>Heart</Text>
                </View>
            </View>

            {/* ===== ACTIVITY CHART ===== */}
            <Text style={s.sectionTitle}>Activity Chart</Text>

            {weekly.length === 0 ? (
                <Text style={s.emptyText}>No weekly data yet.</Text>
            ) : (
                <View style={s.chartBox}>
                    <View style={s.chartBarsRow}>
                        {weekly.map((item, idx) => {
                            const steps = item.steps ?? 0;
                            const ratio = steps / maxSteps;
                            const barHeight = 120 * ratio;

                            return (
                                <View key={idx} style={s.chartBarWrapper}>
                                    <View style={s.chartBarBg}>
                                        <View
                                            style={[
                                                s.chartBarFill,
                                                {
                                                    height: barHeight,
                                                    backgroundColor:
                                                        steps >= stepsGoal ? "#22c55e" : "#3EB489",
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={s.chartDay}>{getDayLabel(item.date)}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* ===== AI HEATMAP ===== */}
            <Text style={s.sectionTitle}>AI Activity Heatmap</Text>

            {weekly.length === 0 ? (
                <Text style={s.emptyText}>No activity to analyze yet.</Text>
            ) : (
                <>
                    <View style={s.heatRow}>
                        {weekly.map((item, idx) => (
                            <View key={idx} style={s.heatCellWrapper}>
                                <View
                                    style={[
                                        s.heatCell,
                                        { backgroundColor: getHeatColor(item.steps) },
                                    ]}
                                />
                                <Text style={s.heatDay}>{getDayLabel(item.date)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* AI Insight */}
                    <View style={s.aiBox}>
                        <Ionicons name="sparkles-outline" size={24} color="#6C63FF" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={s.aiTitle}>Smart Insight</Text>
                            <Text style={s.aiText}>
                                Your most active day is{" "}
                                <Text style={{ fontWeight: "700" }}>
                                    {
                                        getDayLabel(
                                            weekly.reduce((max, cur) =>
                                                (cur.steps ?? 0) > (max.steps ?? 0) ? cur : max
                                            ).date
                                        )
                                    }
                                </Text>{" "}
                                with{" "}
                                {
                                    weekly.reduce((max, cur) =>
                                        (cur.steps ?? 0) > (max.steps ?? 0) ? cur : max
                                    ).steps
                                }{" "}
                                steps.
                            </Text>
                        </View>
                    </View>
                </>
            )}

            {/* GOALS */}
            <Text style={s.sectionTitle}>Today’s Goals</Text>
            <View style={s.goalBox}>
                <Ionicons name="checkmark-circle-outline" size={26} color="#3EB489" />
                <Text style={s.goalText}>Stay hydrated — drink 2 liters of water</Text>
            </View>

            <View style={s.goalBox}>
                <Ionicons name="checkmark-circle-outline" size={26} color="#6C63FF" />
                <Text style={s.goalText}>Walk at least 6,000 steps</Text>
            </View>

            <View style={s.goalBox}>
                <Ionicons name="checkmark-circle-outline" size={26} color="#FFB74D" />
                <Text style={s.goalText}>Sleep 7–8 hours</Text>
            </View>

            {/* TIP */}
            <View style={s.tipBox}>
                <Ionicons name="sparkles-outline" size={28} color="#FF6F61" />
                <Text style={s.tipText}>✨ Even 5 extra minutes of walking matters.</Text>
            </View>
        </ScrollView>
    );
}

/* ===================== STYLES ===================== */
const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 20,
    },

    /* RING */
    ringContainer: { alignItems: "center", marginBottom: 30 },
    ringWrapper: {
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    ring1: { position: "absolute", width: 200, height: 200, borderRadius: 100 },
    ring2: { position: "absolute", width: 160, height: 160, borderRadius: 80 },
    ring3: { position: "absolute", width: 120, height: 120, borderRadius: 60 },
    ringCenter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        elevation: 3,
    },
    ringNumber: { fontSize: 28, fontWeight: "800" },
    ringLabel: { color: "#6B7280" },

    /* Sections */
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 12,
    },

    /* Stats */
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 26,
    },
    statCard: {
        width: "47%",
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        alignItems: "center",
        elevation: 2,
    },
    statValue: { fontSize: 18, fontWeight: "700", marginTop: 4 },
    statLabel: { color: "#6B7280" },

    /* Chart */
    chartBox: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 10,
        marginBottom: 22,
        elevation: 2,
    },
    chartBarsRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        height: 140,
    },
    chartBarWrapper: {
        alignItems: "center",
        flex: 1,
        marginHorizontal: 2,
    },
    chartBarBg: {
        width: 16,
        height: 120,
        borderRadius: 999,
        backgroundColor: "#E5E7EB",
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    chartBarFill: {
        width: "100%",
        borderRadius: 999,
    },
    chartDay: {
        marginTop: 4,
        fontSize: 11,
        color: "#6B7280",
    },

    /* Heatmap */
    heatRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop: 4,
    },
    heatCellWrapper: {
        alignItems: "center",
        flex: 1,
    },
    heatCell: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    heatDay: {
        marginTop: 4,
        fontSize: 11,
        color: "#4b5563",
    },
    aiBox: {
        flexDirection: "row",
        backgroundColor: "#EEF2FF",
        padding: 14,
        borderRadius: 14,
        marginBottom: 24,
        alignItems: "flex-start",
    },
    aiTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#4F46E5",
        marginBottom: 4,
    },
    aiText: {
        fontSize: 13,
        color: "#374151",
        lineHeight: 18,
    },

    /* Goals */
    goalBox: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 14,
        alignItems: "center",
        marginBottom: 10,
        elevation: 2,
        gap: 12,
    },
    goalText: {
        fontSize: 15,
        fontWeight: "600",
        flex: 1,
    },

    /* Tip */
    tipBox: {
        flexDirection: "row",
        marginTop: 20,
        padding: 16,
        borderRadius: 14,
        backgroundColor: "#FFEDE8",
        gap: 12,
    },
    tipText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
        flex: 1,
    },

    emptyText: {
        color: "#9CA3AF",
        marginBottom: 16,
        fontSize: 14,
    },
});
