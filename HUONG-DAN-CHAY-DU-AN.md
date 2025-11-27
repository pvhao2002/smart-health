# Hướng Dẫn Chạy Dự Án Smart Health

Tài liệu này hướng dẫn chi tiết cách cài đặt và chạy từng phần của dự án Smart Health Application.

---

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

### Cho Backend:
- **Java JDK 22** hoặc cao hơn
- **Maven 3.6+**
- **MySQL 8.x**
- **Git**

### Cho Mobile:
- **Node.js 18+** và **npm**
- **Expo CLI** (sẽ được cài tự động)
- **Android Studio** (cho Android) hoặc **Xcode** (cho iOS/macOS)

### Cho Web:
- **Node.js 18+** và **npm**

---

## 🗄️ PHẦN 1: CHẠY BACKEND (Spring Boot)

### Bước 1: Cài Đặt MySQL

#### Trên macOS (sử dụng Homebrew):
```bash
# Cài đặt MySQL
brew install mysql

# Khởi động MySQL
brew services start mysql

# Đăng nhập MySQL (mật khẩu mặc định là rỗng)
mysql -u root
```

#### Trên Windows:
- Tải MySQL từ: https://dev.mysql.com/downloads/mysql/
- Cài đặt và làm theo hướng dẫn
- Mở MySQL Workbench hoặc Command Line

#### Trên Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql -u root
```

### Bước 2: Tạo Database

Sau khi đăng nhập MySQL, chạy các lệnh sau:

```sql
-- Tạo database
CREATE DATABASE health CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user (tùy chọn, hoặc dùng root)
CREATE USER 'healthuser'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON health.* TO 'healthuser'@'localhost';
FLUSH PRIVILEGES;

-- Kiểm tra database đã tạo
SHOW DATABASES;

-- Thoát MySQL
EXIT;
```

### Bước 3: Cấu Hình Backend

Mở file `backend/src/main/resources/application.yml` và kiểm tra cấu hình:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/health?useSSL=false&serverTimezone=UTC
    username: root          # Thay đổi nếu bạn dùng user khác
    password: 1234          # Thay đổi theo mật khẩu MySQL của bạn
```

**Lưu ý:** Nếu mật khẩu MySQL của bạn khác `1234`, hãy cập nhật trong file này.

### Bước 4: Cài Đặt Java và Maven

#### Kiểm tra Java:
```bash
java -version
```

Nếu chưa có Java 22, tải từ: https://www.oracle.com/java/technologies/downloads/

#### Kiểm tra Maven:
```bash
mvn -version
```

Nếu chưa có Maven:
- **macOS**: `brew install maven`
- **Windows**: Tải từ https://maven.apache.org/download.cgi
- **Linux**: `sudo apt install maven`

### Bước 5: Chạy Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies và build project
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

### Bước 6: Kiểm Tra Backend Đã Chạy

Mở trình duyệt và truy cập:
- **Health Check**: http://localhost:1789/health-service/actuator/health
- **API Base URL**: http://localhost:1789/health-service

Bạn sẽ thấy response JSON nếu backend chạy thành công.

### Các Lệnh Backend Hữu Ích:

```bash
# Build project (không chạy)
mvn clean package

# Chạy với profile cụ thể
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Chạy file JAR đã build
java -jar target/backend-api-0.0.1-SNAPSHOT.jar

# Xem logs
tail -f logs/health.log
```

### Xử Lý Lỗi Backend:

**Lỗi: "Access denied for user"**
- Kiểm tra username/password trong `application.yml`
- Đảm bảo MySQL đang chạy: `brew services list` (macOS)

**Lỗi: "Communications link failure"**
- Kiểm tra MySQL đã khởi động chưa
- Kiểm tra port 3306 có bị chiếm không

**Lỗi: "Unknown database 'health'"**
- Chạy lại lệnh `CREATE DATABASE health;` trong MySQL

---

## 📱 PHẦN 2: CHẠY MOBILE APP (React Native/Expo)

### Bước 1: Cài Đặt Node.js

Kiểm tra Node.js:
```bash
node -v
npm -v
```

Nếu chưa có, tải từ: https://nodejs.org/ (khuyến nghị phiên bản LTS)

### Bước 2: Cài Đặt Dependencies

```bash
# Di chuyển vào thư mục mobile
cd mobile

# Cài đặt tất cả dependencies
npm install
```

**Lưu ý:** Quá trình này có thể mất 5-10 phút tùy vào tốc độ mạng.

### Bước 3: Cấu Hình API URL

Mở file `mobile/constants/app-config.ts` và kiểm tra:

```typescript
export const APP_CONFIG = {
    BASE_URL: `http://${localhost}:1789/health-service`,
    // ...
};
```

**Quan trọng:** 
- Nếu chạy trên thiết bị thật, thay `localhost` bằng IP máy tính của bạn
- Tìm IP: `ifconfig` (macOS/Linux) hoặc `ipconfig` (Windows)
- Ví dụ: `http://192.168.1.100:1789/health-service`

### Bước 4: Chạy Mobile App

```bash
# Khởi động Expo development server
npm start
```

Sau khi chạy lệnh này, bạn sẽ thấy QR code và menu với các tùy chọn:

### Bước 5: Chọn Nền Tảng Để Chạy

#### Option A: Chạy trên Android

**Yêu cầu:** Android Studio và Android Emulator đã cài đặt

```bash
# Trong terminal khác (giữ npm start đang chạy)
npm run android

# Hoặc nhấn 'a' trong terminal đang chạy npm start
```

**Cài đặt Android Studio:**
1. Tải từ: https://developer.android.com/studio
2. Cài đặt Android SDK
3. Tạo Virtual Device (AVD) trong AVD Manager
4. Khởi động emulator trước khi chạy `npm run android`

#### Option B: Chạy trên iOS (chỉ macOS)

**Yêu cầu:** Xcode đã cài đặt

```bash
# Trong terminal khác
npm run ios

# Hoặc nhấn 'i' trong terminal đang chạy npm start
```

**Cài đặt Xcode:**
1. Tải từ App Store
2. Mở Xcode và cài đặt Command Line Tools
3. Chạy: `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`

#### Option C: Chạy trên Thiết Bị Thật

1. Cài đặt **Expo Go** từ App Store (iOS) hoặc Play Store (Android)
2. Quét QR code hiển thị trong terminal
3. App sẽ tự động load trên điện thoại

**Lưu ý:** Điện thoại và máy tính phải cùng mạng WiFi

#### Option D: Chạy trên Web Browser

```bash
npm run web

# Hoặc nhấn 'w' trong terminal đang chạy npm start
```

Trình duyệt sẽ tự động mở tại: http://localhost:8081

### Các Lệnh Mobile Hữu Ích:

```bash
# Xóa cache và khởi động lại
npm start -- --clear

# Chạy với tunnel (cho phép truy cập từ mạng khác)
npm start -- --tunnel

# Kiểm tra lỗi code
npm run lint

# Reset project về trạng thái ban đầu
npm run reset-project
```

### Xử Lý Lỗi Mobile:

**Lỗi: "Unable to resolve module"**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
npm start -- --clear
```

**Lỗi: "Network request failed"**
- Kiểm tra backend đã chạy chưa
- Kiểm tra BASE_URL trong `app-config.ts`
- Nếu dùng thiết bị thật, đổi localhost thành IP máy tính

**Lỗi: "Expo Go không kết nối được"**
- Đảm bảo điện thoại và máy tính cùng WiFi
- Tắt firewall tạm thời
- Thử dùng tunnel: `npm start -- --tunnel`

---

## 🌐 PHẦN 3: CHẠY WEB ADMIN (Next.js)

### Bước 1: Cài Đặt Dependencies

```bash
# Di chuyển vào thư mục web
cd web

# Cài đặt tất cả dependencies
npm install
```

### Bước 2: Cấu Hình API URL

Mở file `web/constants/api.ts` và kiểm tra:

```typescript
export const API_BASE_URL = 'http://localhost:1789/health-service';
```

Nếu backend chạy trên server khác, thay đổi URL tương ứng.

### Bước 3: Chạy Development Server

```bash
# Chạy ở chế độ development
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### Bước 4: Truy Cập Web Admin

Mở trình duyệt và truy cập:
- **Trang chủ**: http://localhost:3000
- **Trang đăng nhập**: http://localhost:3000/login
- **Admin Dashboard**: http://localhost:3000/admin

### Bước 5: Build cho Production (Tùy chọn)

```bash
# Build ứng dụng
npm run build

# Chạy production server
npm run start
```

Production server sẽ chạy tại: http://localhost:3000

### Các Lệnh Web Hữu Ích:

```bash
# Kiểm tra lỗi code
npm run lint

# Xóa cache Next.js
rm -rf .next

# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Xử Lý Lỗi Web:

**Lỗi: "Module not found"**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Lỗi: "Port 3000 already in use"**
```bash
# Chạy trên port khác
PORT=3001 npm run dev

# Hoặc kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9
```

**Lỗi: "API request failed"**
- Kiểm tra backend đã chạy chưa
- Kiểm tra API_BASE_URL trong `constants/api.ts`
- Mở DevTools (F12) để xem chi tiết lỗi

---

## 🚀 CHẠY TẤT CẢ CÁC PHẦN CÙNG LÚC

### Cách 1: Sử dụng nhiều Terminal

Mở 3 terminal riêng biệt:

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Mobile:**
```bash
cd mobile
npm start
```

**Terminal 3 - Web:**
```bash
cd web
npm run dev
```

### Cách 2: Sử dụng tmux (macOS/Linux)

```bash
# Cài đặt tmux
brew install tmux  # macOS
# hoặc
sudo apt install tmux  # Linux

# Tạo session mới
tmux new -s smarthealth

# Split terminal
# Ctrl+B rồi nhấn " (split ngang)
# Ctrl+B rồi nhấn % (split dọc)

# Di chuyển giữa các pane
# Ctrl+B rồi nhấn arrow keys

# Chạy từng phần trong mỗi pane
```

### Cách 3: Sử dụng VS Code

1. Mở dự án trong VS Code
2. Mở Terminal (Ctrl + `)
3. Click vào icon "+" để tạo terminal mới
4. Chạy từng phần trong mỗi terminal

---

## 🧪 KIỂM TRA HỆ THỐNG

### 1. Kiểm tra Backend
```bash
curl http://localhost:1789/health-service/actuator/health
```

Kết quả mong đợi:
```json
{
  "status": "UP"
}
```

### 2. Kiểm tra Database
```bash
mysql -u root -p
```

```sql
USE health;
SHOW TABLES;
```

### 3. Kiểm tra Mobile
- Mở Expo Go app
- Quét QR code
- App sẽ load và hiển thị màn hình đăng nhập

### 4. Kiểm tra Web
- Mở http://localhost:3000
- Trang web sẽ hiển thị giao diện đăng nhập

---

## 📝 TÀI KHOẢN MẶC ĐỊNH

Sau khi backend chạy lần đầu, bạn có thể tạo tài khoản thông qua:

### Đăng ký User mới:
- **Endpoint**: POST http://localhost:1789/health-service/auth/register
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyen Van A"
}
```

### Đăng nhập:
- **Endpoint**: POST http://localhost:1789/health-service/auth/login
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🔧 TROUBLESHOOTING CHUNG

### Vấn đề: Port bị chiếm

**Backend (port 1789):**
```bash
# macOS/Linux
lsof -ti:1789 | xargs kill -9

# Windows
netstat -ano | findstr :1789
taskkill /PID <PID> /F
```

**Web (port 3000):**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Vấn đề: MySQL không kết nối được

```bash
# Kiểm tra MySQL đang chạy
# macOS
brew services list

# Linux
sudo systemctl status mysql

# Khởi động lại MySQL
# macOS
brew services restart mysql

# Linux
sudo systemctl restart mysql
```

### Vấn đề: Dependencies lỗi

```bash
# Backend
cd backend
mvn clean install -U

# Mobile
cd mobile
rm -rf node_modules package-lock.json
npm install

# Web
cd web
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 TÀI LIỆU THAM KHẢO

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Expo**: https://docs.expo.dev/
- **Next.js**: https://nextjs.org/docs
- **MySQL**: https://dev.mysql.com/doc/

---

## 💡 MẸO HỮU ÍCH

1. **Luôn chạy Backend trước** khi chạy Mobile và Web
2. **Kiểm tra logs** khi gặp lỗi:
   - Backend: `logs/health.log`
   - Mobile: Terminal đang chạy `npm start`
   - Web: Browser DevTools Console
3. **Sử dụng Postman** để test API trước khi tích hợp
4. **Commit code thường xuyên** để tránh mất dữ liệu
5. **Đọc error messages cẩn thận** - chúng thường chỉ ra vấn đề

---

## 🆘 HỖ TRỢ

Nếu gặp vấn đề không giải quyết được:

1. Kiểm tra logs chi tiết
2. Google error message
3. Kiểm tra GitHub Issues của thư viện liên quan
4. Hỏi team members

---

**Chúc bạn code vui vẻ! 🎉**
