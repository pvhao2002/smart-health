import {useCallback, useState} from "react";
import {Alert} from "react-native";
import {APP_CONFIG} from "@/constants/app-config";

export function useMealLogs(token: string) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [mealList, setMealList] = useState<any[]>([]);
    const [loadingMealList, setLoadingMealList] = useState(true);

    const fetchMealLogs = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/meal-logs/my`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            setLogs(json.data ?? []);
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    const fetchMealList = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/admin/meals`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            const json = await res.json();
            setMealList(json.data ?? json);
        } catch (e) {
            console.log(e);
        } finally {
            setLoadingMealList(false);
        }
    }, [token]);

    const addMeal = async (body: any, onSuccess: () => void) => {
        try {
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

            onSuccess();
            fetchMealLogs();
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    };

    return {
        logs,
        mealList,
        loading,
        loadingMealList,
        refreshing,

        fetchMealLogs,
        fetchMealList,
        addMeal,
        setRefreshing
    };
}
