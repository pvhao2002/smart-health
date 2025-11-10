import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
    medicineId: number;
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (medicineId: number) => void;
    clearCart: () => void;
    getTotalQuantity: () => number;
    getTotalPrice: () => number;
    updateQuantity: (medicineId: number, delta?: number) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            /** 🔹 Cập nhật số lượng (+1, -1, hoặc set cụ thể) */
            updateQuantity: (medicineId, delta = 0) => {
                const newItems = get().items.map((it) => {
                    if (it.medicineId === medicineId) {
                        const newQty = Math.max(1, it.quantity + delta);
                        return { ...it, quantity: newQty };
                    }
                    return it;
                });
                set({ items: newItems });
            },

            /** 🔹 Thêm sản phẩm vào giỏ */
            addItem: (item) => {
                const currentItems = get().items;
                const existing = currentItems.find(
                    (it) => it.medicineId === item.medicineId
                );

                if (existing) {
                    // Nếu đã có → tăng số lượng
                    const updated = currentItems.map((it) =>
                        it.medicineId === item.medicineId
                            ? { ...it, quantity: it.quantity + item.quantity }
                            : it
                    );
                    set({ items: updated });
                } else {
                    // Nếu chưa có → thêm mới
                    set({ items: [...currentItems, item] });
                }
            },

            /** 🔹 Xoá sản phẩm */
            removeItem: (medicineId) => {
                set({
                    items: get().items.filter((it) => it.medicineId !== medicineId),
                });
            },

            /** 🔹 Xoá toàn bộ giỏ hàng */
            clearCart: () => set({ items: [] }),

            /** 🔹 Tổng số lượng */
            getTotalQuantity: () =>
                get().items.reduce((sum, it) => sum + it.quantity, 0),

            /** 🔹 Tổng tiền */
            getTotalPrice: () =>
                get().items.reduce((sum, it) => sum + it.price * it.quantity, 0),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
