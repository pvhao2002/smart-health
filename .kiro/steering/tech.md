# Công Nghệ Sử Dụng

## Backend (Java/Spring Boot)

- **Framework**: Spring Boot 3.3.5
- **Phiên Bản Java**: 22
- **Công Cụ Build**: Maven
- **Cơ Sở Dữ Liệu**: MySQL 8.x
- **ORM**: Spring Data JPA với Hibernate
- **Bảo Mật**: Spring Security + JWT (io.jsonwebtoken 0.12.6)
- **Validation**: Jakarta Validation
- **Tiện Ích**: Lombok để giảm code boilerplate

### Lệnh Backend

```bash
# Di chuyển đến thư mục backend
cd backend

# Build dự án
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run

# Chạy trên port cụ thể (mặc định: 1789)
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=1789

# Đóng gói thành JAR
mvn package
```

### Cấu Hình Backend

- Server chạy trên port **1789**
- Context path: `/health-service`
- Database: MySQL trên localhost:3306/health
- Logs: `logs/health.log`

## Mobile (React Native/Expo)

- **Framework**: Expo ~54.0.22
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Navigation**: Expo Router 6.x + React Navigation
- **Quản Lý State**: Zustand 5.x
- **HTTP Client**: Axios 1.13.2
- **UI Components**: Expo Vector Icons, Linear Gradient
- **Ngôn Ngữ**: TypeScript 5.9.2

### Lệnh Mobile

```bash
# Di chuyển đến thư mục mobile
cd mobile

# Cài đặt dependencies
npm install

# Khởi động development server
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên web
npm run web

# Kiểm tra code
npm run lint
```

## Web (Next.js)

- **Framework**: Next.js 16.0.1
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4.x
- **Thư Viện UI**: Ant Design 5.28.0
- **Biểu Đồ**: Recharts 3.3.0
- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React
- **Ngôn Ngữ**: TypeScript 5.x

### Lệnh Web

```bash
# Di chuyển đến thư mục web
cd web

# Cài đặt dependencies
npm install

# Khởi động development server
npm run dev

# Build cho production
npm run build

# Khởi động production server
npm run start

# Kiểm tra code
npm run lint
```

## Giao Tiếp API

Cả ba thành phần giao tiếp qua REST API:
- Base URL: `http://localhost:1789/health-service`
- Xác thực: Bearer token trong Authorization header
- Định dạng response: ApiResponse chuẩn hóa
