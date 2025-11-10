import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from '@/constants/app-config';

export default function HistoryScreen() {
    const { user } = useAuthStore();
    const token = user?.token;
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasNext, setHasNext] = useState(false);

    const fetchOrders = useCallback(
        async (reset = false) => {
            if (!token) {
                router.replace('/login');
                return;
            }
            try {
                if (reset) setPage(0);
                if (!reset) setLoading(true);

                const res = await fetch(
                    `${APP_CONFIG.BASE_URL}/orders/my-orders?page=${reset ? 0 : page}&size=${size}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const json = await res.json();
                if (!res.ok || json.success === false)
                    throw new Error(json.error?.message || json.message || 'Failed to load orders');

                const data = json.data ?? json;
                reset ? setOrders(data.content) : setOrders((prev) => [...prev, ...data.content]);
                setHasNext(data.hasNext);
            } catch (err: any) {
                console.error('❌ Fetch orders error:', err);
                Alert.alert('Error', err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [token, router, page, size]
    );

    useEffect(() => {
        fetchOrders(true);
    }, [fetchOrders]);

    useEffect(() => {
        if (page > 0) fetchOrders(false);
    }, [page, fetchOrders]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders(true);
    };

    const handleCancel = async (orderId: number) => {
        Alert.alert('Confirm', 'Do you really want to cancel this order?', [
            { text: 'No' },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        const res = await fetch(`${APP_CONFIG.BASE_URL}/orders/${orderId}/cancel`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        const json = await res.json();
                        if (!res.ok || json.success === false)
                            throw new Error(json.error?.message || json.message || 'Cancel failed');

                        Alert.alert('✅ Success', 'Order has been cancelled.');
                        fetchOrders(true);
                    } catch (err: any) {
                        Alert.alert('❌ Error', err.message || 'Failed to cancel order');
                    }
                },
            },
        ]);
    };

    const renderOrder = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/order-detail', params: { id: item.id } })}
        >
            <View style={s.card}>
                <View style={s.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="person-circle-outline" size={22} color="#009688" />
                        <Text style={s.buyer}>{item.userName || 'Customer'}</Text>
                    </View>
                    <Text style={[s.status, getStatusStyle(item.status)]}>{item.status}</Text>
                </View>

                <Text style={s.dateText}>
                    🗓 {new Date(item.createdAt).toLocaleString('vi-VN')}
                </Text>

                <View style={s.row}>
                    <Ionicons name="location-outline" size={18} color="#6b7280" />
                    <Text numberOfLines={1} style={s.address}>{item.shippingAddress}</Text>
                </View>

                <View style={s.row}>
                    <Ionicons name="call-outline" size={18} color="#6b7280" />
                    <Text style={s.phone}>{item.phone ?? 'N/A'}</Text>
                </View>

                <View style={s.row}>
                    <Ionicons name="card-outline" size={18} color="#6b7280" />
                    <Text style={s.payment}>Payment: {item.paymentMethod} · {item.itemCount} items</Text>
                </View>

                <View style={s.divider} />

                <View style={s.footer}>
                    <View>
                        <Text style={s.totalLabel}>Total Amount</Text>
                        <Text style={s.totalValue}>{Number(item.total).toLocaleString('vi-VN')} ₫</Text>
                    </View>

                    {(item.status === 'PENDING' ||
                        (item.status === 'PROCESSING' && item.paymentMethod !== 'VNPAY')) && (
                        <TouchableOpacity style={s.cancelBtn} onPress={() => handleCancel(item.id)}>
                            <Ionicons name="close-circle-outline" size={18} color="#fff" />
                            <Text style={s.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () =>
        hasNext ? <ActivityIndicator style={{ marginVertical: 20 }} color="#00ADEF" /> : null;

    if (loading && !orders.length) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color="#00ADEF" />
                <Text style={s.loadingText}>Loading your orders...</Text>
            </View>
        );
    }

    return (
        <View style={s.container}>
            <View style={s.header}>
                <Ionicons name="bag-handle-outline" size={24} color="#00ADEF" />
                <Text style={s.title}>My Orders</Text>
            </View>

            {orders.length === 0 ? (
                <View style={s.empty}>
                    <Ionicons name="file-tray-outline" size={60} color="#9ca3af" />
                    <Text style={s.emptyText}>You have no orders yet</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => setPage((p) => (hasNext ? p + 1 : p))}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ADEF" />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'DELIVERED':
            return { color: '#16A34A', backgroundColor: '#E7F9ED' };
        case 'PROCESSING':
            return { color: '#00ADEF', backgroundColor: '#EAF8FB' };
        case 'SHIPPED':
            return { color: '#009688', backgroundColor: '#E0F7F3' };
        case 'CANCELLED':
            return { color: '#DC2626', backgroundColor: '#FEE2E2' };
        case 'PENDING':
        default:
            return { color: '#F57C00', backgroundColor: '#FFF3E0' };
    }
};

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 14 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14 },
    title: { fontSize: 20, fontWeight: '700', color: '#1F2937' },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#00ADEF',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    buyer: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
    status: {
        fontWeight: '700',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        overflow: 'hidden',
        textTransform: 'capitalize',
        fontSize: 13,
    },
    dateText: { color: '#6B7280', fontSize: 12, marginVertical: 8 },

    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    address: { color: '#374151', fontSize: 13, flex: 1 },
    phone: { color: '#374151', fontSize: 13 },
    payment: { color: '#374151', fontSize: 13 },

    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 13, color: '#6B7280' },
    totalValue: { fontWeight: '800', color: '#009688', fontSize: 17 },

    cancelBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DC2626',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 6,
    },
    cancelText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#6B7280' },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, color: '#9CA3AF', fontSize: 15 },
});
