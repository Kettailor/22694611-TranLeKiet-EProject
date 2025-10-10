# 🧱 EProject-Phase-1 – Microservices System (Docker Compose Edition)

Hệ thống **EProject-Phase-1** mô phỏng mô hình **thương mại điện tử** gồm nhiều microservice giao tiếp qua **RabbitMQ** và **MongoDB**.  
Triển khai và chạy toàn bộ project thông qua **Docker Compose**.

---

## 📑 MỤC LỤC

- [🧱 EProject-Phase-1 – Microservices System (Docker Compose Edition)](#-eproject-phase-1--microservices-system-docker-compose-edition)
  - [📑 MỤC LỤC](#-mục-lục)
  - [📘 Giới thiệu](#-giới-thiệu)
  - [📁 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
  - [🐳 Chạy dự án với Docker Compose](#-chạy-dự-án-với-docker-compose)
    - [1️⃣ Build container](#1️⃣-build-container)
    - [2️⃣ Khởi động MongoDB và RabbitMQ](#2️⃣-khởi-động-mongodb-và-rabbitmq)
    - [3️⃣ Khởi động các microservices](#3️⃣-khởi-động-các-microservices)
  - [🌐 Đường dẫn truy cập các service](#-đường-dẫn-truy-cập-các-service)
  - [🧩 Thử nghiệm dự án với POSTMAN](#-thử-nghiệm-dự-án-với-postman)
  - [🧹 Dừng và làm sạch hệ thống](#-dừng-và-làm-sạch-hệ-thống)
    - [Dừng tất cả container](#dừng-tất-cả-container)
    - [Xóa dữ liệu, image, network (build sạch)](#xóa-dữ-liệu-image-network-build-sạch)
  - [💡 Khắc phục lỗi thường gặp](#-khắc-phục-lỗi-thường-gặp)
  - [👨‍💻 Tác giả](#-tác-giả)

---

## 📘 Giới thiệu

Dự án bao gồm 4 microservice:

| Service | Mô tả | Port |
|----------|-------|------|
| **Auth Service** | Đăng ký & đăng nhập người dùng (JWT) | 3000 |
| **Product Service** | Quản lý sản phẩm, gửi sự kiện RabbitMQ | 3001 |
| **Order Service** | Nhận sự kiện đơn hàng từ RabbitMQ | 3002 |
| **API Gateway** | Định tuyến request đến các service | 3003 |

Cơ sở dữ liệu và message broker:
- **MongoDB** – Lưu trữ dữ liệu người dùng, sản phẩm, đơn hàng.
- **RabbitMQ** – Truyền thông điệp giữa các service.

---

## 📁 Cấu trúc thư mục

```
EProject-Phase-1/
 ┣ api-gateway/
 ┣ auth/
 ┣ order/
 ┣ product/
 ┣ docker-compose.yml (Tự xây dựng)
 ┗ README.md
```

Mỗi service chứa:
- `index.js` – Điểm khởi động chính
- `src/` – Controller, route, model
- `.env` – Biến môi trường riêng

---

## 🐳 Chạy dự án với Docker Compose

### 1️⃣ Build container
```bash
docker-compose build
```

---

### 2️⃣ Khởi động MongoDB và RabbitMQ
```bash
docker-compose up -d mongodb rabbitmq
```

---

### 3️⃣ Khởi động các microservices
Sau khi MongoDB và RabbitMQ ổn định:
```bash
docker-compose up -d auth product order api-gateway
```

---

## 🌐 Đường dẫn truy cập các service

| Thành phần | URL | Ghi chú |
|-------------|------|----------|
| 🟢 API Gateway | [http://localhost:3003](http://localhost:3003) | Cổng chính của hệ thống |
| 🔐 Auth Service | [http://localhost:3000](http://localhost:3000) | Đăng ký / đăng nhập |
| 📦 Product Service | [http://localhost:3001](http://localhost:3001) | CRUD sản phẩm |
| 🧾 Order Service | [http://localhost:3002](http://localhost:3002) | Quản lý đơn hàng |

---

## 🧩 Thử nghiệm dự án với POSTMAN
**Auth Service**

![Register](assets/img/regis.png)
![Login](assets/img/login.png)
![Dashboard](assets/img/dashboard.png)

**Product Service**

![createProduct](assets/img/createProduct.png)
![getProduct](assets/img/getProduct.png)
![buyProduct](assets/img/buyProduct.png)

**DataBase**

![data](assets/img/data.png)

---

## 🧹 Dừng và làm sạch hệ thống

### Dừng tất cả container
```bash
docker-compose down
```

### Xóa dữ liệu, image, network (build sạch)
```bash
docker-compose down -v --rmi all --remove-orphans
```

---

## 💡 Khắc phục lỗi thường gặp

| Lỗi | Nguyên nhân | Cách khắc phục |
|------|--------------|----------------|
| `ECONNREFUSED ::1:5672` | Product chưa thấy RabbitMQ | Kiểm tra `.env` → dùng `amqp://guest:guest@rabbitmq:5672` |
| `ECONNREFUSED ::1:3000` | Test gọi Auth bằng localhost | Sửa test: `http://auth:3000/login` |
| RabbitMQ dừng ngay khi start | Port 5672/15672 bị chiếm | Đổi port trong compose, hoặc dừng app chiếm port |
| MongoDB không kết nối | Sai hostname hoặc chưa khởi động | Dùng `mongodb://mongodb:27017/...` |
| `Cannot find module 'dotenv'` | Package bị thiếu | Thêm `dotenv` vào dependencies và rebuild image |
| Không thấy container nào chạy | Docker Desktop chưa mở | Bật Docker Desktop trước khi chạy lệnh |

---

## 👨‍💻 Tác giả

- **Sinh viên:** Trần Lê Kiệt
- **Mã SV:** 22694611
- **Môn học:** Lập trình hướng dịch vụ  
- **Giảng viên hướng dẫn:** ThS. Huỳnh Nam

---
