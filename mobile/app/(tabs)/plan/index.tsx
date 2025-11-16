import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from "react-native";
import axios from "axios";
import {Ionicons} from "@expo/vector-icons";
import {APP_CONFIG} from "@/constants/app-config";
import {WebView} from "react-native-webview";

const {width} = Dimensions.get("window");

interface WorkoutScheduleDTO {
    id: number;
    name: string;
    goal: string;
    dayOfWeek: string;
    isRestDay: boolean;
    workouts: {
        id: number;
        name: string;
        reps?: string;
        sets?: number;
        duration?: number;
        url?: string;
        ytbUrl?: string;
    } | null;
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

interface MealPlanDTO {
    id: number;
    name: string;
    goal: string;
    dayOfWeek: string;

    breakfast?: MealDTO;
    lunch?: MealDTO;
    dinner?: MealDTO;
    snack?: MealDTO;

    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}


export default function PlanScreen() {
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutScheduleDTO[]>([]);
    const [mealPlan, setMealPlan] = useState<MealPlanDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"workout" | "meal">("workout");

    /* ============================
       LOAD WORKOUT + MEAL PLAN
    ============================ */
    const loadPlans = async () => {
        try {
            setLoading(true);

            const [workRes, mealRes] = await Promise.all([
                axios.get(`${APP_CONFIG.BASE_URL}/admin/plans/workouts`),
                axios.get(`${APP_CONFIG.BASE_URL}/admin/plans/meals`)
            ]);

            setWorkoutPlan(workRes.data ?? []);
            setMealPlan(mealRes.data ?? []);
        } catch (e) {
            console.error("Load plan error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Plans</Text>
            </View>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tabItem, activeTab === "workout" && styles.tabActive]}
                    onPress={() => setActiveTab("workout")}
                >
                    <Text style={[styles.tabText, activeTab === "workout" && styles.tabTextActive]}>
                        Workout
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabItem, activeTab === "meal" && styles.tabActive]}
                    onPress={() => setActiveTab("meal")}
                >
                    <Text style={[styles.tabText, activeTab === "meal" && styles.tabTextActive]}>
                        Meal Plan
                    </Text>
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
            <View style={{flex: 1}}>
                {activeTab === "workout" ? (
                    <WorkoutContent data={workoutPlan}/>
                ) : (
                    <MealContent data={mealPlan}/>
                )}
            </View>
        </View>
    );
}

function WorkoutContent({data}: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyBox}>
                <Ionicons name="barbell-outline" size={50} color="#9CA3AF"/>
                <Text style={styles.emptyText}>No workout schedules available.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{padding: 16, paddingBottom: 120}}
            renderItem={({item}) => (
                <View style={styles.workoutCard}>
                    {/* Header */}
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={styles.workoutTitle}>{item.name}</Text>
                        <Text style={styles.workoutDay}>{item.dayOfWeek}</Text>
                    </View>

                    <Text style={styles.workoutGoal}>Goal: {item.goal}</Text>

                    {item.isRestDay ? (
                        <Text style={styles.restDay}>🛌 Rest Day</Text>
                    ) : (
                        <View style={{marginTop: 10}}>
                            <Text style={styles.exerciseTitle}>Workout:</Text>
                            <Text style={styles.exerciseItem}>• {item.workouts?.name}</Text>

                            {item.workouts?.caloriesPerMinute && (
                                <Text style={styles.exerciseItem}>- Calories: {item.workouts.caloriesPerMinute}</Text>
                            )}

                            {item.workouts?.level && (
                                <Text style={styles.exerciseItem}>- Level: {item.workouts.level}</Text>
                            )}

                            {/* VIDEO YOUTUBE */}
                            {item.workouts?.url && (
                                <View style={{marginTop: 12, height: 200, borderRadius: 10, overflow: "hidden"}}>
                                    <WebView
                                        source={{uri: item.workouts.ytbUrl}}
                                        style={{flex: 1}}
                                        javaScriptEnabled
                                        domStorageEnabled
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}
        />
    );
}

/* --------------------------
    MEAL CONTENT
--------------------------- */
function MealContent({data}: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <View style={styles.emptyBox}>
                <Ionicons name="restaurant-outline" size={50} color="#9CA3AF"/>
                <Text style={styles.emptyText}>No meal plans available.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{padding: 16, paddingBottom: 120}}
            renderItem={({item}) => (
                <View style={styles.mealCard}>
                    {/* Header */}
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={styles.mealTitle}>{item.name}</Text>
                        <Text style={styles.mealDay}>{item.dayOfWeek}</Text>
                    </View>

                    <Text style={styles.mealGoal}>Goal: {item.goal}</Text>

                    {/* 4 Meals */}
                    {renderMealRow("Breakfast", item.breakfast)}
                    {renderMealRow("Lunch", item.lunch)}
                    {renderMealRow("Dinner", item.dinner)}
                    {renderMealRow("Snack", item.snack)}

                    {/* Summary */}
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryText}>🔥 {item.totalCalories} kcal</Text>
                        <Text style={styles.summaryText}>🥩 {item.totalProtein}g protein</Text>
                        <Text style={styles.summaryText}>🍚 {item.totalCarbs}g carbs</Text>
                        <Text style={styles.summaryText}>🧈 {item.totalFat}g fat</Text>
                    </View>
                </View>
            )}
        />
    );
}

/* Render row for 1 meal type */

/* Render row for 1 meal type */
function renderMealRow(label: string, meal: any) {
    return (
        <View style={styles.mealRow}>
            <Text style={styles.mealLabel}>{label}</Text>

            {meal ? (
                <View style={{flexDirection: "row", marginTop: 6}}>

                    {/* Image */}
                    <Image
                        source={{uri: meal.url}}
                        style={styles.mealImage}
                    />

                    {/* Meal Info */}
                    <View style={{flex: 1, marginLeft: 10}}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <Text style={styles.mealCalories}>🔥 {meal.calories} kcal</Text>

                        <View style={{marginTop: 4}}>
                            <Text style={styles.macroText}>🥩 Protein: {meal.protein} g</Text>
                            <Text style={styles.macroText}>🍚 Carbs: {meal.carbs} g</Text>
                            <Text style={styles.macroText}>🧈 Fat: {meal.fat} g</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <Text style={styles.mealEmpty}>—</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },

    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB"
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827"
    },

    /* Segmented Tabs */
    tabs: {
        flexDirection: "row",
        backgroundColor: "#E5E7EB",
        margin: 16,
        padding: 5,
        borderRadius: 12,
    },
    tabItem: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    tabText: {
        color: "#6B7280",
        fontSize: 15,
        fontWeight: "600"
    },
    tabActive: {
        backgroundColor: "#10B981",   // green
    },
    tabTextActive: {
        color: "#fff"
    },

    centerBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    /*  WORKOUT  */
    workoutCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    workoutTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    workoutDay: {
        fontSize: 14,
        color: "#6B7280",
    },
    workoutGoal: {
        marginTop: 4,
        fontSize: 14,
        color: "#10B981",
        fontWeight: "600",
    },
    restDay: {
        marginTop: 10,
        fontSize: 16,
        color: "#EF4444",
        fontWeight: "700",
    },
    exerciseTitle: {
        fontWeight: "700",
        fontSize: 15,
        marginBottom: 4,
    },
    exerciseItem: {
        fontSize: 14,
        color: "#374151",
        marginLeft: 6,
    },

    /* MEAL */
    mealCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },
    mealDay: {
        fontSize: 14,
        color: "#6B7280",
    },
    mealGoal: {
        marginTop: 4,
        fontSize: 14,
        color: "#F59E0B",
        fontWeight: "600",
    },
    mealRow: {
        marginTop: 12,
    },
    mealLabel: {
        fontWeight: "700",
        color: "#374151",
    },
    mealName: {
        fontSize: 15,
        color: "#111827",
    },
    mealCalories: {
        fontSize: 13,
        color: "#6B7280",
    },
    mealEmpty: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    summaryBox: {
        marginTop: 12,
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        paddingTop: 10,
    },
    summaryText: {
        fontSize: 14,
        color: "#111827",
        marginTop: 2,
    },

    /* Empty */
    emptyBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: "#9CA3AF",
    },
    mealImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: "#E5E7EB",
    },

    macroText: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 1,
    },
});
