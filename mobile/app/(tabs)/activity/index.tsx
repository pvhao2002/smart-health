import React from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useCartStore} from '@/store/cartStore';
import {useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function CartScreen() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) => s.removeItem);
    const clearCart = useCartStore((s) => s.clearCart);
    const updateQuantity = useCartStore((s) => s.updateQuantity);

    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
    const totalPrice = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    return (
        <>
            <View style={s.header}>
                <Text style={s.headerTitle}>🛒 My Pharmacy Cart</Text>
            </View>

            {items.length === 0 ? (
                <View style={s.emptyBox}>
                    <Ionicons name="cart-outline" size={80} color="#9ca3af"/>
                    <Text style={s.emptyText}>Your cart is empty</Text>
                    <TouchableOpacity
                        style={s.shopBtn}
                        onPress={() => router.push('/medicine')}
                    >
                        <Ionicons name="medkit-outline" size={18} color="#fff"/>
                        <Text style={s.shopText}>Browse Medicines</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {/* 🧾 List */}
                    <FlatList
                        data={items}
                        keyExtractor={(_, i) => i.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{paddingBottom: 90}}
                        renderItem={({item}) => (
                            <View style={s.card}>
                                <Image source={{uri: item.image}} style={s.img}/>
                                <View style={{flex: 1}}>
                                    <Text style={s.name} numberOfLines={2}>
                                        {item.name}
                                    </Text>
                                    <Text style={s.price}>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                    </Text>

                                    {/* Quantity controls */}
                                    <View style={s.qtyRow}>
                                        <TouchableOpacity
                                            style={s.qtyBtn}
                                            onPress={() => updateQuantity(item.medicineId, -1)}
                                        >
                                            <Text style={s.qtyBtnText}>−</Text>
                                        </TouchableOpacity>
                                        <Text style={s.qtyValue}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={s.qtyBtn}
                                            onPress={() => updateQuantity(item.medicineId, +1)}
                                        >
                                            <Text style={s.qtyBtnText}>＋</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => removeItem(item.medicineId)}>
                                    <Ionicons name="trash-outline" size={22} color="#DC2626"/>
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* ✅ Gộp summary + hành động (1 tầng) */}
                    <View style={s.bottomSummary}>
                        <View style={s.totalBox}>
                            <Text style={s.totalLabel}>
                                Total ({totalItems} {totalItems > 1 ? 'items' : 'item'})
                            </Text>
                            <Text style={s.totalPrice}>
                                {totalPrice.toLocaleString('vi-VN')} ₫
                            </Text>
                        </View>

                        <View style={s.actionBox}>
                            <TouchableOpacity style={s.clearBtn} onPress={clearCart}>
                                <Ionicons name="close-circle-outline" size={18} color="#009688"/>
                                <Text style={s.clearText}>Clear</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={s.checkoutBtn}
                                onPress={() => router.push('/checkout')}
                            >
                                <Ionicons name="cash-outline" size={20} color="#fff"/>
                                <Text style={s.checkoutText}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </>
    );
}

const s = StyleSheet.create({
    header: {
        backgroundColor: '#00ADEF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#00ADEF',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    headerTitle: {color: '#fff', fontSize: 20, fontWeight: '700'},

    emptyBox: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    emptyText: {marginTop: 10, color: '#6b7280', fontSize: 16},
    shopBtn: {
        marginTop: 20,
        backgroundColor: '#009688',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    shopText: {color: '#fff', marginLeft: 6, fontWeight: '600'},

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    img: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: '#EAF8FB',
    },
    name: {fontWeight: '600', fontSize: 15, color: '#1F2937'},
    price: {color: '#009688', fontWeight: '700', marginTop: 4, fontSize: 15},

    qtyRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8},
    qtyBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EAF8FB',
    },
    qtyBtnText: {fontSize: 18, fontWeight: '700', color: '#1F2937'},
    qtyValue: {minWidth: 26, textAlign: 'center', fontWeight: '600'},

    bottomSummary: {
        position: 'absolute',
        bottom: 90,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    totalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalLabel: {fontSize: 15, color: '#6b7280', fontWeight: '500'},
    totalPrice: {fontSize: 20, fontWeight: '800', color: '#00ADEF'},

    actionBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clearBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#009688',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    clearText: {color: '#009688', fontWeight: '600', marginLeft: 6},

    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F57C00',
        borderRadius: 30,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    checkoutText: {color: '#fff', fontWeight: '700', marginLeft: 6},
});
