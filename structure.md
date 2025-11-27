# Cấu Trúc Dự Án

## Tổ Chức Thư Mục Gốc

```
/
├── backend/          # Spring Boot REST API
├── mobile/           # Ứng dụng di động Expo/React Native
├── web/              # Bảng điều khiển admin Next.js
└── logs/             # Logs ứng dụng
```

## Cấu Trúc Backend (`backend/`)

Tuân theo kiến trúc phân lớp chuẩn của Spring Boot:

```
backend/src/main/java/com/health/
├── SmartHealthApplication.java    # Điểm khởi đầu chính
├── config/                        # Các class cấu hình
│   ├── SecurityConfig.java        # Thiết lập Spring Security
│   ├── WebConfig.java             # CORS, interceptors
│   └── ApiResponseInterceptor.java
├── controller/                    # REST endpoints
│   ├── AuthController.java        # /auth/*
│   ├── UserController.java        # /users/*
│   ├── Admin*Controller.java      # /admin/*
│   └── ...
├── dto/                           # Data Transfer Objects
│   ├── auth/                      # Login, register requests
│   ├── admin/                     # DTOs dành cho admin
│   ├── user/                      # DTOs hồ sơ người dùng
│   └── common/                    # ApiResponse, PagedResponse
├── entity/                        # JPA entities
│   ├── User.java
│   ├── UserProfile.java
│   ├── HealthRecord.java
│   ├── Meal.java, MealPlan.java
│   └── WorkoutSchedule.java, WorkoutType.java
├── repository/                    # Spring Data JPA repositories
├── service/                       # Business logic
│   └── impl/                      # Triển khai service
├── security/                      # JWT, UserDetails
│   ├── JwtUtil.java
│   ├── JwtRequestFilter.java
│   └── CustomUserDetailsService.java
├── exception/                     # Custom exceptions + handler
│   └── GlobalExceptionHandler.java
├── validation/                    # Custom validators
└── util/                          # Tiện ích hỗ trợ
```

### Quy Ước Backend

- **Controllers**: Xử lý HTTP requests, ủy quyền cho services
- **Services**: Chứa business logic, quản lý transaction
- **Repositories**: Lớp truy cập dữ liệu (Spring Data JPA)
- **DTOs**: Tách biệt request/response objects khỏi entities
- **Entities**: JPA entities với Lombok annotations (@Entity, @Getter, @Setter, @Builder)
- **Exception Handling**: Tập trung trong GlobalExceptionHandler
- **Validation**: Sử dụng Jakarta validation annotations (@Valid, @NotNull, etc.)

## Cấu Trúc Mobile (`mobile/`)

Expo Router với file-based routing:

```
mobile/
├── app/                           # Routes (dựa trên file)
│   ├── _layout.tsx                # Root layout
│   ├── login.tsx                  # /login
│   ├── register.tsx               # /register
│   └── (tabs)/                    # Tab navigation
│       ├── _layout.tsx            # Tab layout
│       ├── index.tsx              # Home tab
│       ├── activity/              # Activity tab
│       ├── plan/                  # Plan tab
│       ├── profile/               # Profile tab
│       └── record/                # Record tab
├── components/                    # UI components tái sử dụng
│   ├── ui/                        # Base UI components
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/                     # Cấu hình ứng dụng
│   ├── app-config.ts              # API endpoints, base URL
│   └── theme.ts                   # Colors, spacing
├── hooks/                         # Custom React hooks
│   ├── useHealthRecords.tsx
│   └── useMealLogs.tsx
├── store/                         # Quản lý state với Zustand
│   ├── authStore.ts               # Auth state
│   └── cartStore.ts
└── assets/                        # Hình ảnh, fonts
```

### Quy Ước Mobile

- **Routing**: File-based với Expo Router (folders = routes)
- **State**: Zustand cho global state (auth, cart)
- **API Calls**: Axios với base URL từ app-config.ts
- **Styling**: Inline styles hoặc themed components
- **Navigation**: Stack + Tabs navigation

## Cấu Trúc Web (`web/`)

Next.js App Router:

```
web/
├── app/                           # Routes (dựa trên file)
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Trang chủ
│   ├── globals.css                # Global styles
│   ├── login/                     # /login
│   │   └── page.tsx
│   ├── admin/                     # /admin/*
│   │   ├── layout.tsx             # Admin layout (sidebar)
│   │   ├── page.tsx               # Dashboard
│   │   ├── users/                 # Quản lý người dùng
│   │   ├── meals/                 # Quản lý bữa ăn
│   │   ├── meal-plan/             # Quản lý kế hoạch bữa ăn
│   │   └── workouts/              # Quản lý bài tập
│   ├── components/                # Shared components
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── DataTable.tsx
│   │   ├── Modal.tsx
│   │   └── *.css                  # Component styles
│   └── model/                     # TypeScript types
├── api/                           # API client utilities
│   └── apiClient.ts
├── constants/                     # Cấu hình
│   └── api.ts                     # API endpoints
└── public/                        # Static assets
```

### Quy Ước Web

- **Routing**: File-based với Next.js App Router
- **Styling**: Tailwind CSS + component-specific CSS files
- **Components**: Functional components với TypeScript
- **API**: Axios client với endpoints tập trung
- **Admin Layout**: Sidebar + header wrapper cho admin pages
- **UI Library**: Ant Design cho tables, modals, forms

## Các Pattern Chung

### Định Dạng API Response

Tất cả backend endpoints trả về responses chuẩn hóa:

```typescript
{
  success: boolean,
  message?: string,
  data?: T,
  timestamp: LocalDateTime
}
```

### Luồng Xác Thực

1. Login → nhận access token + refresh token
2. Lưu tokens (AsyncStorage cho mobile, localStorage cho web)
3. Thêm Bearer token vào Authorization header
4. Refresh token khi access token hết hạn

### Quy Ước Đặt Tên

- **Java**: PascalCase cho classes, camelCase cho methods/variables
- **TypeScript**: PascalCase cho components/types, camelCase cho functions/variables
- **Files**: kebab-case cho CSS, PascalCase cho React components
- **Endpoints**: kebab-case cho URLs (`/meal-plan`, `/health-records`)
