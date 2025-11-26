import {Stack} from "expo-router";
import {Platform} from "react-native";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,               // ⭐ bật header mặc định cho tất cả màn hình
                headerBackTitle: "",            // ⭐ Fix: không hiện chữ "index"
                headerBackButtonDisplayMode: "minimal",
                headerTitleAlign: "center",
                headerTintColor: "#3EB489",     // màu icon: xanh mint
                headerStyle: {
                    backgroundColor: "#ebf1f6", // màu nền header
                },
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#1F2937",
                },
                animation: Platform.select({
                    ios: "slide_from_right",
                    android: "fade",
                }),
            }}
        >
            {/* ⭐ Màn hình Profile index — ẩn header */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* Các màn hình khác tự động dùng header đẹp */}
            <Stack.Screen
                name="update-profile"
                options={{
                    title: "Chỉnh sửa hồ sơ",
                }}
            />

            <Stack.Screen
                name="support"
                options={{
                    title: "Trung tâm hỗ trợ",
                }}
            />

            <Stack.Screen
                name="about"
                options={{
                    title: "Giới thiệu ứng dụng",
                }}
            />

            <Stack.Screen
                name="change-password"
                options={{
                    title: "Đổi mật khẩu",
                }}
            />
        </Stack>
    );
}
