import {Stack} from "expo-router";
import {Platform} from "react-native";

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,               // ⭐ bật header cho tất cả mặc định
                headerBackTitle: "",            // ⭐ Fix: không hiện chữ "index"
                headerBackButtonDisplayMode: "minimal",
                headerTitleAlign: "center",
                headerTintColor: "#3EB489",     // icon màu mint green
                headerStyle: {
                    backgroundColor: "#ebf1f6", // màu nền sáng
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
            {/* ⭐ Profile index — hide header */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            {/* Các file khác tự động dùng header đẹp */}
            <Stack.Screen
                name="update-profile"
                options={{
                    title: "Edit Profile",
                }}
            />

            <Stack.Screen
                name="support"
                options={{
                    title: "Support Center",
                }}
            />

            <Stack.Screen
                name="about"
                options={{
                    title: "About App",
                }}
            />

            <Stack.Screen
                name="change-password"
                options={{
                    title: "Change Password",
                }}
            />
        </Stack>
    );
}
