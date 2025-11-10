import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useCartStore} from '@/store/cartStore';
import {useAuthStore} from '@/store/authStore';
import {useRouter} from 'expo-router';
import {APP_CONFIG} from "@/constants/app-config";
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function CheckoutScreen() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const token = user?.token;
    const {items, clearCart} = useCartStore();

    const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // 🔹 Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                router.replace('/login');
                return;
            }

            try {
                setLoadingProfile(true);
                const res = await fetch(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.AUTH.PROFILE}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                if (!res.ok) throw new Error('Failed to load profile');

                const data = await res.json();
                if (data) {
                    setPhone(data.phone || '');
                    setAddress(data.address || '');
                }
            } catch {
                Alert.alert('⚠️', 'Cannot load user profile. Please login again.');
                router.replace('/login');
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [token]);

    // 🔹 Checkout handler
    const handleCheckout = async () => {
        if (!address || !phone) {
            Alert.alert('⚠️ Missing Info', 'Please fill all required fields.');
            return;
        }

        const requestBody = {
            items: items.map((it) => ({
                medicineId: it.medicineId,
                quantity: it.quantity,
            })),
            shippingAddress: address,
            paymentMethod,
            phone,
        };

        try {
            setLoading(true);
            const res = await fetch(`${APP_CONFIG.BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Failed to create order');
            }

            const data = await res.json();

            // VNPay payment flow
            if (paymentMethod === 'VNPAY') {
                const redirectUrl = Linking.createURL('payment/success', {
                    queryParams: {method: paymentMethod, orderId: data.id.toString()},
                });

                const paymentReq = {
                    orderId: data.id,
                    amount: data.total,
                    paymentMethod: 'VNPAY',
                };

                const payRes = await fetch(`${APP_CONFIG.BASE_URL}/payment/process`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                    body: JSON.stringify(paymentReq),
                });

                const json = await payRes.json();
                if (!payRes.ok || !json.data.paymentUrl) throw new Error(json.message || 'Create payment failed');

                const result = await WebBrowser.openAuthSessionAsync(json.data.paymentUrl, redirectUrl);
                if (result.type === 'success') {
                    clearCart();
                    router.replace({
                        pathname: '/payment-success',
                        params: {orderId: data.id, status: 'success', method: 'VNPAY'},
                    });
                } else {
                    await cancelOrder(data.id);
                    router.replace({
                        pathname: '/payment-success',
                        params: {orderId: data.id, status: 'fail', method: 'VNPAY'},
                    });
                }
            } else {
                clearCart();
                Alert.alert('✅ Success', 'Your order has been placed successfully!', [
                    {text: 'OK', onPress: () => router.replace('/(tabs)/history')},
                ]);
            }
        } catch (err: any) {
            Alert.alert('❌ Error', err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (oid: string) => {
        await fetch(`${APP_CONFIG.BASE_URL}/payment/cancel/${oid}`, {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`},
        });
    };

    if (loadingProfile) {
        return (
            <View style={[s.container, s.center]}>
                <ActivityIndicator size="large" color="#00ADEF"/>
                <Text style={{marginTop: 10, color: '#6b7280'}}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
            <Text style={s.title}>🧾 Checkout</Text>

            {/* 🚚 Shipping */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Shipping Info</Text>
                <TextInput
                    placeholder="Full Address"
                    value={address}
                    onChangeText={setAddress}
                    style={s.input}
                />
                <TextInput
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    style={s.input}
                />
            </View>

            {/* 💳 Payment */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Payment Method</Text>
                {['COD', 'VNPAY'].map((method) => (
                    <TouchableOpacity
                        key={method}
                        style={[s.payOption, paymentMethod === method && s.paySelected]}
                        onPress={() => setPaymentMethod(method as any)}
                    >
                        <Ionicons
                            name={paymentMethod === method ? 'radio-button-on' : 'radio-button-off'}
                            size={22}
                            color={paymentMethod === method ? '#00ADEF' : '#9CA3AF'}
                        />
                        <View style={{marginLeft: 10}}>
                            <Text style={s.payLabel}>
                                {method === 'COD' ? 'Cash on Delivery (COD)' : 'VNPay Online Payment'}
                            </Text>
                            <Text style={s.payDesc}>
                                {method === 'COD'
                                    ? 'Pay with cash upon delivery'
                                    : 'Pay securely via VNPay gateway'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 🧾 Order Summary */}
            <View style={[s.section, {backgroundColor: '#EAF8FB', borderRadius: 16, padding: 16}]}>
                <Text style={[s.sectionTitle, {color: '#009688'}]}>Order Summary</Text>
                {items.map((it, i) => (
                    <View key={i} style={s.orderRow}>
                        <Text style={s.orderName}>{it.name} × {it.quantity}</Text>
                        <Text style={s.orderPrice}>
                            {(it.price * it.quantity).toLocaleString('vi-VN')} ₫
                        </Text>
                    </View>
                ))}
                <View style={s.divider}/>
                <View style={s.orderRow}>
                    <Text style={s.orderTotalLabel}>Total</Text>
                    <Text style={s.orderTotalValue}>
                        {totalPrice.toLocaleString('vi-VN')} ₫
                    </Text>
                </View>
            </View>

            {/* 🧡 Checkout button */}
            <TouchableOpacity
                style={[s.checkoutBtn, loading && {opacity: 0.7}]}
                onPress={handleCheckout}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff"/>
                ) : (
                    <>
                        <Ionicons name="bag-check-outline" size={22} color="#fff"/>
                        <Text style={s.checkoutText}>Place Order</Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#F9FAFB', padding: 16},
    center: {justifyContent: 'center', alignItems: 'center'},
    title: {fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 20},
    section: {marginBottom: 26},
    sectionTitle: {fontSize: 17, fontWeight: '700', color: '#1F2937', marginBottom: 10},

    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },

    payOption: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    paySelected: {borderColor: '#00ADEF', backgroundColor: '#EAF8FB'},
    payLabel: {fontWeight: '600', color: '#1F2937'},
    payDesc: {fontSize: 13, color: '#6b7280', marginTop: 2},

    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    orderName: {fontSize: 14, color: '#1F2937', flex: 1},
    orderPrice: {fontWeight: '600', color: '#009688'},
    divider: {height: 1, backgroundColor: '#E5E7EB', marginVertical: 10},
    orderTotalLabel: {fontWeight: '700', color: '#1F2937', fontSize: 16},
    orderTotalValue: {fontWeight: '800', color: '#00ADEF', fontSize: 18},

    checkoutBtn: {
        backgroundColor: '#F57C00',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        paddingVertical: 14,
        marginTop: 20,
        gap: 8,
        shadowColor: '#F57C00',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    checkoutText: {color: '#fff', fontWeight: '700', fontSize: 16},
});
