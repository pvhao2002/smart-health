import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { APP_CONFIG } from '@/constants/app-config';
import { useCartStore } from '@/store/cartStore';

const { width, height } = Dimensions.get('window');

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    images: string[];
    stock?: number;
    category?: { id: number; name: string };
}

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showZoom, setShowZoom] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(0);
    const [cartMessage, setCartMessage] = useState<string | null>(null);

    const flatListRef = useRef<FlatList>(null);
    const addToCart = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (product && (!product.stock || product.stock <= 0)) {
            setCartMessage('❌ Out of stock.');
            return;
        }

        const cartItem = {
            medicineId: product!.id,
            name: product!.name,
            price: product!.price,
            image: product!.images?.[0],
            quantity: 1,
        };

        addToCart(cartItem);
        setCartMessage('✅ Added to cart!');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${APP_CONFIG.BASE_URL}${APP_CONFIG.API.PRODUCTS.BASE}/${id}`
                );
                setProduct(res.data);
            } catch (err) {
                console.error('Error loading product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (cartMessage) {
            const timer = setTimeout(() => setCartMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [cartMessage]);

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    if (loading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color="#00ADEF" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={s.center}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <View style={s.safe}>
            <ScrollView
                style={s.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* 📸 Banner / Carousel */}
                <View style={s.carouselContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={product.images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => {
                                    setZoomIndex(index);
                                    setShowZoom(true);
                                }}
                            >
                                <Image source={{ uri: item }} style={s.imageSlide} />
                            </TouchableOpacity>
                        )}
                    />
                    <View style={s.indicatorContainer}>
                        {product.images.map((_, i) => (
                            <View key={i} style={[s.dot, activeIndex === i && s.dotActive]} />
                        ))}
                    </View>
                </View>

                {/* 🧾 Toast */}
                {cartMessage && (
                    <View style={s.toastBox}>
                        <Text style={s.toastText}>{cartMessage}</Text>
                    </View>
                )}

                {/* 🩺 Product Info Card */}
                <View style={s.infoCard}>
                    <Text style={s.name}>{product.name}</Text>
                    {product.category?.name && (
                        <Text style={s.category}>{product.category.name}</Text>
                    )}
                    <Text style={s.price}>{product.price.toLocaleString('vi-VN')} ₫</Text>

                    {product.stock !== undefined && (
                        <Text style={s.stockText}>Stock: {product.stock} items</Text>
                    )}

                    <View style={s.line} />
                    <Text style={s.descTitle}>Description</Text>
                    <Text style={s.desc}>
                        {product.description || 'No description available.'}
                    </Text>
                </View>
            </ScrollView>

            {/* 🛒 Sticky Bottom Bar */}
            <View style={s.bottomBar}>
                <TouchableOpacity style={s.cartBtn} onPress={handleAddToCart}>
                    <Ionicons name="cart-outline" size={22} color="#fff" />
                    <Text style={s.cartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>

            {/* 🔍 Zoom modal */}
            <Modal visible={showZoom} transparent animationType="fade">
                <View style={s.zoomBackdrop}>
                    <FlatList
                        data={product.images}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={zoomIndex}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                style={{
                                    width,
                                    height,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={s.zoomImage}
                                    resizeMode="contain"
                                />
                            </Pressable>
                        )}
                    />
                    <TouchableOpacity
                        style={s.closeZoom}
                        onPress={() => setShowZoom(false)}
                    >
                        <Ionicons name="close-circle" size={36} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    carouselContainer: { position: 'relative' },
    imageSlide: { width, height: 340, resizeMode: 'cover' },
    indicatorContainer: {
        position: 'absolute',
        bottom: 12,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#d1d5db',
    },
    dotActive: { backgroundColor: '#00ADEF' },

    infoCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    name: { fontSize: 22, fontWeight: '800', color: '#1F2937' },
    category: { color: '#6b7280', marginTop: 4 },
    price: { color: '#009688', fontWeight: '800', fontSize: 20, marginTop: 8 },
    stockText: { color: '#6b7280', fontSize: 13, marginTop: 6 },

    line: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 14 },
    descTitle: { fontWeight: '700', fontSize: 16, color: '#111827' },
    desc: { color: '#4b5563', marginTop: 6, lineHeight: 20 },

    toastBox: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        backgroundColor: '#009688',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        zIndex: 10,
    },
    toastText: { color: '#fff', fontWeight: '600' },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        elevation: 12,
    },
    cartBtn: {
        flex: 1,
        backgroundColor: '#00ADEF',
        borderRadius: 30,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    cartText: { color: '#fff', fontWeight: '700', marginLeft: 6 },

    buyBtn: {
        flex: 1,
        backgroundColor: '#F57C00',
        borderRadius: 30,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyText: { color: '#fff', fontWeight: '700', marginLeft: 6 },

    zoomBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomImage: { width, height: height * 0.85 },
    closeZoom: { position: 'absolute', top: 50, right: 20 },
});
