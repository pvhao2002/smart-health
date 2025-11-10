import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { APP_CONFIG } from '@/constants/app-config';

const { width } = Dimensions.get('window');

interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
}

interface Category {
    id: number;
    name: string;
    productCount?: number;
}

export default function HomeScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [prod, cat] = await Promise.all([
                axios.get(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.PRODUCTS.NEWEST}`),
                axios.get(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.CATEGORIES.BASE}`),
            ]);
            setProducts(prod.data ?? []);
            setCategories(cat.data ?? []);
        } catch (err) {
            console.warn('⚠️ loadAll failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={s.productCard}
            activeOpacity={0.85}
            onPress={() => router.push(`/(medicine)/${item.id}`)}
        >
            <Image
                source={{ uri: item.images?.[0] || `${APP_CONFIG.IMAGE_URL}/placeholder.jpg` }}
                style={s.productImage}
            />
            <Text style={s.productName} numberOfLines={1}>
                {item.name}
            </Text>
            <Text style={s.productPrice}>{item.price.toLocaleString('vi-VN')} ₫</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView
            style={s.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00ADEF']} />}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={s.header}>
                <Text style={s.brand}>PharmaCare</Text>
            </View>

            {/* Banner */}
            <View style={s.bannerContainer}>
                <Image
                    source={require('@/assets/images/banner4.webp')}
                    style={s.bannerImage}
                />
            </View>

            {/* Categories */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>🧾 Shop by Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((cat) => (
                        <TouchableOpacity key={cat.id} style={s.categoryCard} activeOpacity={0.85}>
                            <Ionicons name="medkit-outline" size={22} color="#009688" />
                            <Text style={s.categoryText} numberOfLines={1}>
                                {cat.name}
                            </Text>
                            {cat.productCount && (
                                <Text style={s.categoryCount}>{cat.productCount} items</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Best Sellers */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>💊 Best Sellers</Text>
                {loading ? (
                    <ActivityIndicator size="small" color="#00ADEF" style={{ marginVertical: 10 }} />
                ) : products.length > 0 ? (
                    <FlatList
                        data={products}
                        horizontal
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <Text style={s.noProduct}>No best sellers yet.</Text>
                )}
            </View>

            {/* Health Tip Box */}
            <View style={s.tipBox}>
                <Ionicons name="leaf-outline" size={22} color="#009688" />
                <Text style={s.tipText}>
                    💡 Health Tip: Drink at least 2L of water a day and take your vitamins regularly.
                </Text>
            </View>

            {/* 🆕 New Arrivals */}
            <View style={s.section}>
                <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>🆕 New Arrivals</Text>
                    <TouchableOpacity onPress={() => router.push('/product')}>
                        <Text style={s.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#00ADEF" style={{ marginVertical: 10 }} />
                ) : products.length > 0 ? (
                    <View style={s.gridWrap}>
                        {products.slice(0, 8).map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={s.gridCard}
                                activeOpacity={0.85}
                                onPress={() => router.push(`/(medicine)/${item.id}`)}
                            >
                                <Image
                                    source={{ uri: item.images?.[0] || `${APP_CONFIG.IMAGE_URL}/placeholder.jpg` }}
                                    style={s.gridImg}
                                />
                                <Text style={s.gridName} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={s.gridPrice}>{item.price.toLocaleString('vi-VN')} ₫</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <Text style={s.noProduct}>No new products yet.</Text>
                )}
            </View>


            {/* Featured Section */}
            <View style={s.featuredBox}>
                <Image source={require('@/assets/images/banner2.jpg')} style={s.featuredImg} />
            </View>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 6,
    },
    brand: { fontSize: 26, fontWeight: '800', color: '#009688' },

    bannerContainer: { position: 'relative', marginTop: 10 },
    bannerImage: {
        width: width - 24,
        height: 180,
        borderRadius: 18,
        marginHorizontal: 12,
        resizeMode: 'cover',
    },
    bannerTextBox: { position: 'absolute', bottom: 20, left: 24 },
    bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
    bannerSubtitle: { color: '#E0F2FE', marginTop: 4 },
    bannerBtn: {
        marginTop: 10,
        backgroundColor: '#00ADEF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    bannerBtnText: { color: '#fff', fontWeight: '700' },

    section: { marginTop: 24, paddingHorizontal: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
    viewAll: { color: '#00ADEF', fontWeight: '600' },
    noProduct: { marginTop: 8, color: '#9CA3AF', textAlign: 'center' },

    tipBox: {
        backgroundColor: '#EAF8FB',
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#009688',
    },
    tipText: { marginLeft: 8, color: '#1F2937', fontSize: 13, flex: 1, lineHeight: 18 },

    categoryCard: {
        backgroundColor: '#F3F4F6',
        padding: 10,
        marginRight: 10,
        borderRadius: 14,
        alignItems: 'center',
        width: 100,
    },
    categoryText: { marginTop: 4, fontSize: 13, fontWeight: '600', color: '#1F2937' },
    categoryCount: { fontSize: 11, color: '#6B7280', marginTop: 2 },

    productCard: {
        width: 140,
        marginRight: 14,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    productImage: { width: '100%', height: 120, borderRadius: 10, marginBottom: 6 },
    productName: { fontWeight: '600', fontSize: 14, color: '#111827' },
    productPrice: { fontWeight: '700', color: '#009688', marginTop: 4 },

    featuredBox: {
        marginTop: 30,
        marginHorizontal: 14,
        backgroundColor: '#EAF8FB',
        borderRadius: 16,
        overflow: 'hidden',
    },
    featuredImg: { width: '100%', height: 160, resizeMode: 'cover' },
    featuredText: { position: 'absolute', top: 20, left: 20, right: 20 },
    featuredTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
    featuredDesc: { color: '#374151', marginTop: 4 },
    featuredBtn: {
        marginTop: 10,
        backgroundColor: '#00ADEF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    featuredBtnText: { color: '#fff', fontWeight: '700' },
    gridWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    gridCard: {
        width: (width - 48) / 2,
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 16,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    gridImg: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 8,
    },
    gridName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    gridPrice: {
        marginTop: 4,
        fontWeight: '700',
        color: '#009688',
    },

});
