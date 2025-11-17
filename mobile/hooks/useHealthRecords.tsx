import {useCallback, useState} from "react";
import {Alert} from "react-native";
import {APP_CONFIG} from "@/constants/app-config";

export function useHealthRecords(token: string) {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userHeightCm, setUserHeightCm] = useState<number | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/users/profile`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const json = await res.json();
            setUserHeightCm(json?.data?.heightCm ?? null);
        } catch {
        }
    }, [token]);

    const fetchRecords = useCallback(async () => {
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/health-records/my`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            setRecords(json.data ?? []);
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    const calculateBMI = (weight: string) => {
        if (!weight || !userHeightCm) return "";
        const h = userHeightCm / 100;
        return (parseFloat(weight) / (h * h)).toFixed(2);
    };

    const addRecord = async (body: any, onSuccess: () => void) => {
        try {
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

            onSuccess();
            fetchRecords();
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    return {
        records,
        loading,
        refreshing,
        userHeightCm,

        fetchProfile,
        fetchRecords,
        calculateBMI,
        addRecord,
        setRefreshing
    };
}
