import React, {useEffect, useState, useCallback} from 'react';
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
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {APP_CONFIG} from '@/constants/app-config';

export default function HealthHistoryScreen() {
    const {user, logout} = useAuthStore(); // ✅ thêm logout
    const token = user?.token;
    const router = useRouter();

    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newRecord, setNewRecord] = useState({
        weight: '',
        heartRate: '',
        sleepHours: '',
        note: '',
    });

    /** =========================
     *  FETCH RECORDS
     *  ========================= */
    const fetchRecords = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${APP_CONFIG.BASE_URL}/health-records/my`, {
                headers: {Authorization: `Bearer ${token}`},
            });

            // ✅ Check token expired
            if (res.status === 401) {
                Alert.alert('Session expired', 'Please login again.');
                logout();
                router.replace('/login');
                return;
            }

            const json = await res.json();
            if (!res.ok || json.success === false)
                throw new Error(json.error?.message || json.message || 'Failed to load records');

            setRecords(json.data ?? json);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token, logout, router]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchRecords();
    };

    /** =========================
     *  ADD NEW RECORD
     *  ========================= */
    const handleAddRecord = async () => {
        if (!newRecord.weight) return Alert.alert('⚠️', 'Please enter your weight.');

        try {
            const body = {
                weight: parseFloat(newRecord.weight),
                heartRate: newRecord.heartRate ? parseInt(newRecord.heartRate) : null,
                sleepHours: newRecord.sleepHours ? parseFloat(newRecord.sleepHours) : null,
                note: newRecord.note,
            };

            const res = await fetch(`${APP_CONFIG.BASE_URL}/health-records`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // ✅ Nếu token hết hạn
            if (res.status === 401) {
                Alert.alert('Session expired', 'Please login again.');
                logout();
                router.replace('/login');
                return;
            }

            const json = await res.json();
            if (!res.ok || json.success === false)
                throw new Error(json.error?.message || json.message || 'Failed to save record');

            Alert.alert('✅ Success', 'Health record saved!');
            setModalVisible(false);
            setNewRecord({weight: '', heartRate: '', sleepHours: '', note: ''});
            fetchRecords();
        } catch (err: any) {
            Alert.alert('❌ Error', err.message);
        }
    };

    /** =========================
     *  RENDER EACH RECORD
     *  ========================= */
    const renderRecord = ({item}: { item: any }) => (
        <View style={s.card}>
            <View style={s.cardHeader}>
                <Ionicons name="calendar-outline" size={20} color="#00ADEF"/>
                <Text style={s.date}>{new Date(item.date).toLocaleDateString('vi-VN')}</Text>
            </View>

            <View style={s.row}>
                <Ionicons name="barbell-outline" size={18} color="#16A34A"/>
                <Text style={s.text}>Weight: {item.weight} kg</Text>
            </View>
            <View style={s.row}>
                <Ionicons name="body-outline" size={18} color="#f97316"/>
                <Text style={s.text}>BMI: {item.bmi?.toFixed(2) ?? '—'}</Text>
            </View>
            <View style={s.row}>
                <Ionicons name="heart-outline" size={18} color="#DC2626"/>
                <Text style={s.text}>Heart Rate: {item.heartRate ?? '—'} bpm</Text>
            </View>
            <View style={s.row}>
                <Ionicons name="moon-outline" size={18} color="#3b82f6"/>
                <Text style={s.text}>Sleep: {item.sleepHours ?? '—'} h</Text>
            </View>

            {item.note && <Text style={s.note}>📝 {item.note}</Text>}
        </View>
    );

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Ionicons name="pulse-outline" size={26} color="#00ADEF"/>
                <Text style={s.title}>Health History</Text>
            </View>

            <TouchableOpacity style={s.addBtn} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle-outline" size={22} color="#fff"/>
                <Text style={s.addText}>Add Today’s Record</Text>
            </TouchableOpacity>

            {loading ? (
                <View style={s.center}>
                    <ActivityIndicator size="large" color="#00ADEF"/>
                </View>
            ) : (
                <FlatList
                    data={records}
                    renderItem={renderRecord}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ADEF"/>
                    }
                    contentContainerStyle={{paddingBottom: 30}}
                />
            )}

            {/* ===== Add Record Modal ===== */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={s.modalOverlay}>
                    <View style={s.modalContent}>
                        <Text style={s.modalTitle}>Add Health Record</Text>

                        <TextInput
                            style={s.input}
                            placeholder="Weight (kg)"
                            keyboardType="numeric"
                            value={newRecord.weight}
                            onChangeText={(v) => setNewRecord({...newRecord, weight: v})}
                        />
                        <TextInput
                            style={s.input}
                            placeholder="Heart rate (bpm)"
                            keyboardType="numeric"
                            value={newRecord.heartRate}
                            onChangeText={(v) => setNewRecord({...newRecord, heartRate: v})}
                        />
                        <TextInput
                            style={s.input}
                            placeholder="Sleep hours"
                            keyboardType="numeric"
                            value={newRecord.sleepHours}
                            onChangeText={(v) => setNewRecord({...newRecord, sleepHours: v})}
                        />
                        <TextInput
                            style={[s.input, {height: 80}]}
                            placeholder="Note"
                            multiline
                            value={newRecord.note}
                            onChangeText={(v) => setNewRecord({...newRecord, note: v})}
                        />

                        <View style={s.modalActions}>
                            <TouchableOpacity style={s.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={s.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={s.saveBtn} onPress={handleAddRecord}>
                                <Text style={s.saveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 16},
    header: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14},
    title: {fontSize: 20, fontWeight: '700', color: '#1F2937'},

    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: '#00ADEF',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginBottom: 12,
    },
    addText: {color: '#fff', fontWeight: '600', marginLeft: 6},

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8},
    date: {fontWeight: '700', color: '#111827', fontSize: 15},

    row: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4},
    text: {fontSize: 14, color: '#374151'},
    note: {fontStyle: 'italic', color: '#6b7280', marginTop: 4, fontSize: 13},

    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {fontWeight: '700', fontSize: 18, marginBottom: 10},
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
        color: '#111827',
    },
    modalActions: {flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10},
    cancelBtn: {paddingVertical: 8, paddingHorizontal: 16},
    cancelText: {color: '#6B7280', fontWeight: '600'},
    saveBtn: {backgroundColor: '#00ADEF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16},
    saveText: {color: '#fff', fontWeight: '700'},
});
