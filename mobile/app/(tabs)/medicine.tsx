import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Dimensions,
    Modal,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { APP_CONFIG } from '@/constants/app-config';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Medicine {
    id: number;
    name: string;
    price: number;
    images: string[];
    category?: { id: number; name: string };
}

interface Category {
    id: number;
    name: string;
}

interface PagedResponse<T> {
    content: T[];
    page: number;
    totalPages: number;
}

export default function ProductScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Medicine[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    // 🩺 Gọi API
    const loadAll = async (pageNum = 0, searchQuery = '') => {
        try {
            setLoading(true);

            const [prodRes, catRes] = await Promise.all([
                axios.get(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.PRODUCTS.BASE}`, {
                    params: { page: pageNum, size: 10, search: searchQuery || undefined },
                }),
                axios.get(`${APP_CONFIG.BASE_URL}${APP_CONFIG.API.CATEGORIES.BASE}`),
            ]);

            const prodData: PagedResponse<Medicine> = prodRes.data;
            setProducts(pageNum === 0 ? prodData.content : [...products, ...prodData.content]);
            setTotalPages(prodData.totalPages ?? 1);
            setPage(pageNum);
            setCategories(catRes.data ?? []);
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadAll(0);
    }, []);

    const onRefresh = useCallback(() => {
        loadAll(0, search);
    }, [search]);

    const handleLoadMore = () => {
        if (!loading && page + 1 < totalPages) loadAll(page + 1, search);
    };

    const handleSearch = () => loadAll(0, search);

    const renderItem = ({ item }: { item: Medicine }) => (
        <TouchableOpacity
            style={s.card}
            activeOpacity={0.85}
            onPress={() => router.push(`/(medicine)/${item.id}`)}
        >
            <Image
                source={{
                    uri: item.images?.[0] || `${APP_CONFIG.IMAGE_URL}/placeholder.jpg`,
                }}
                style={s.image}
            />
            <View style={s.info}>
                <Text style={s.name} numberOfLines={2}>{item.name}</Text>
                <Text style={s.category}>{item.category?.name ?? 'Uncategorized'}</Text>
                <Text style={s.price}>{item.price.toLocaleString('vi-VN')} ₫</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={s.container}>
            {/* 🔹 Banner */}
            <View style={s.bannerBox}>
                <Image
                    source={require('@/assets/images/banner4.webp')}
                    style={s.bannerImage}
                />
            </View>

            {/* 🔹 Header */}
            <View style={s.header}>
                <Text style={s.title}>All Medicines</Text>
                <TouchableOpacity onPress={onRefresh}>
                    <Ionicons name="refresh-outline" size={22} color="#009688" />
                </TouchableOpacity>
            </View>

            {/* 🔍 Search box */}
            <View style={s.searchBox}>
                <Ionicons name="search-outline" size={20} color="#6b7280" />
                <TextInput
                    style={s.searchInput}
                    placeholder="Search medicines, vitamins..."
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    placeholderTextColor="#9ca3af"
                />
                {search !== '' && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {/* 📦 Product grid */}
            {products.length === 0 && loading ? (
                <ActivityIndicator size="large" color="#00ADEF" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={products}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#00ADEF']}
                            tintColor="#00ADEF"
                        />
                    }
                    ListFooterComponent={
                        loading && products.length > 0 ? (
                            <ActivityIndicator size="small" color="#00ADEF" style={{ marginVertical: 10 }} />
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },

    bannerBox: { position: 'relative', height: 180 },
    bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#EAF8FB',
        borderBottomWidth: 1,
        borderBottomColor: '#dbeafe',
    },
    title: { fontSize: 22, fontWeight: '800', color: '#009688' },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: { flex: 1, marginLeft: 6, color: '#1F2937', fontSize: 15 },

    card: {
        backgroundColor: '#fff',
        width: (width - 40) / 2,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
        backgroundColor: '#EAF8FB',
    },
    info: { padding: 10 },
    name: { fontWeight: '600', fontSize: 14, color: '#1F2937' },
    category: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    price: { color: '#009688', fontWeight: '700', marginTop: 6, fontSize: 15 },
});
