# Ứng Dụng Sức Khỏe Thông Minh

Nền tảng quản lý sức khỏe và thể dục toàn diện với ba thành phần chính:

- **Backend API**: Dịch vụ RESTful cho theo dõi sức khỏe, lập kế hoạch bữa ăn, lịch tập luyện và quản lý người dùng
- **Ứng Dụng Di Động**: Ứng dụng React Native/Expo cho người dùng cuối để theo dõi hồ sơ sức khỏe, bữa ăn và bài tập
- **Web Admin**: Bảng điều khiển Next.js cho quản trị viên quản lý người dùng, bữa ăn, kế hoạch tập luyện và xem phân tích

## Tính Năng Chính

- Xác thực người dùng với JWT (access token + refresh token)
- Theo dõi hồ sơ sức khỏe (cân nặng, BMI, calories)
- Ghi nhật ký bữa ăn và quản lý kế hoạch bữa ăn
- Lập lịch tập luyện và theo dõi buổi tập
- Bảng điều khiển quản trị với quản lý người dùng
- Kiểm soát truy cập dựa trên vai trò (USER/ADMIN)

## Đối Tượng Người Dùng

- Người dùng cuối: Theo dõi các chỉ số sức khỏe cá nhân, bữa ăn và bài tập qua ứng dụng di động
- Quản trị viên: Quản lý nội dung, người dùng và xem phân tích qua bảng điều khiển web
