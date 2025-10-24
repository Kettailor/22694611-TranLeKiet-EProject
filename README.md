# Nền tảng Microservices EProject

[![CI/CD](https://github.com/Kettailor/22694611-TranLeKiet-EProject/actions/workflows/ci.yml/badge.svg)](https://github.com/Kettailor/22694611-TranLeKiet-EProject/actions/workflows/ci.yml)

EProject là một môi trường microservices phục vụ mục đích học tập, mô phỏng quy trình thương mại điện tử được tách thành các dịch vụ Node.js độc lập. Dự án minh họa các khối chức năng phổ biến như xác thực người dùng, quản lý sản phẩm, xử lý đơn hàng và một API Gateway, tất cả đều được điều phối bằng Docker Compose cùng các dịch vụ nền MongoDB và RabbitMQ.

## Tính năng nổi bật

- **Auth Service**: Đăng ký, đăng nhập, phát hành JWT và bảo vệ các tuyến API yêu cầu xác thực.
- **Product Service**: Quản lý dữ liệu sản phẩm, xuất bản sự kiện sản phẩm lên RabbitMQ.
- **Order Service**: Nhận đơn đặt hàng, lắng nghe sự kiện sản phẩm và phối hợp xử lý qua RabbitMQ.
- **API Gateway**: Đầu vào duy nhất cho client, chuyển tiếp lưu lượng đến các dịch vụ con và gom cấu hình định tuyến.
- **Bộ công cụ chung**: Hỗ trợ kiểm thử với Mocha/Chai và quy trình tự động hóa qua GitHub Actions.

## Kiến trúc hệ thống

| Thành phần | Mô tả | Cổng mặc định |
| --- | --- | --- |
| `auth` | Dịch vụ xác thực, kết nối MongoDB để lưu trữ người dùng. | `3000` |
| `product` | Dịch vụ sản phẩm, quản lý catalog và xuất bản sự kiện lên RabbitMQ. | `3001` |
| `order` | Dịch vụ đơn hàng, tiêu thụ sự kiện sản phẩm và lưu đơn hàng vào MongoDB. | `3002` |
| `api-gateway` | Lớp định tuyến, proxy cho `/auth`, `/products`, `/orders`. | `3003` |
| `mongo` | Cơ sở dữ liệu MongoDB dùng chung. | `27017` |
| `rabbitmq` | Bộ trung gian thông điệp, giao tiếp bất đồng bộ. | `5672` (AMQP) / `15672` (UI quản lý) |

Các dịch vụ giao tiếp với nhau qua REST (HTTP) và hàng đợi RabbitMQ (`orders`, `products`). Mỗi dịch vụ đều hỗ trợ ghi đè cấu hình thông qua biến môi trường.

```
.
├── api-gateway        # Lớp định tuyến và reverse proxy
├── auth               # Dịch vụ xác thực (MongoDB + JWT)
├── order              # Dịch vụ xử lý đơn hàng (MongoDB + RabbitMQ consumer)
├── product            # Dịch vụ sản phẩm (MongoDB + RabbitMQ publisher)
├── utils              # Thư viện dùng chung
├── docker-compose.yml # Khởi chạy toàn bộ stack với Docker Compose
└── .github/workflows  # Quy trình CI/CD
```

## Kết quả kiểm thử Postman

![register](./assests/img/image.png)
![login](./assests/img/image-1.png)
![dashboard](./assests/img/image-2.png)
![create_product](./assests/img/image-3.png)
![get_product](./assests/img/image-4.png)
![create_order](./assests/img/image-5.png)

## Bắt đầu sử dụng

### Yêu cầu hệ thống

- [Node.js 18+](https://nodejs.org/) để chạy dịch vụ cục bộ và thực thi bộ kiểm thử.
- [Docker](https://www.docker.com/) và [Docker Compose](https://docs.docker.com/compose/) để khởi chạy môi trường container.
- (Tuỳ chọn) Cụm MongoDB và RabbitMQ riêng nếu không dùng Docker Compose.

### Cấu hình biến môi trường

Mỗi dịch vụ đọc cấu hình qua biến môi trường với giá trị mặc định hợp lý:

- `auth`: `PORT`, `MONGODB_AUTH_URI`, `JWT_SECRET`.
- `product`: `PORT`, `MONGODB_PRODUCT_URI`, `RABBITMQ_URI`, `RABBITMQ_ORDER_QUEUE`, `RABBITMQ_PRODUCT_QUEUE`, `JWT_SECRET`, `RABBITMQ_CONNECT_DELAY_MS`.
- `order`: `PORT`, `MONGODB_ORDER_URI`, `RABBITMQ_URI`, `RABBITMQ_ORDER_QUEUE`, `RABBITMQ_PRODUCT_QUEUE`, `JWT_SECRET`, `RABBITMQ_CONNECT_DELAY_MS`.
- `api-gateway`: `PORT`, `AUTH_SERVICE_URL`, `PRODUCT_SERVICE_URL`, `ORDER_SERVICE_URL` hoặc bộ biến `_HOST`/`_PORT` tương ứng.

Sao chép các biến cần thiết vào file `.env` trong từng thư mục dịch vụ (ví dụ: `auth/.env`, `product/.env`, ...).

> **Thông tin RabbitMQ:** Docker Compose khởi tạo RabbitMQ với người dùng `app` / `app`. Các dịch vụ mặc định kết nối tới `amqp://app:app@rabbitmq:5672`, hãy đảm bảo `.env` tuỳ chỉnh của bạn phù hợp.

### Chạy bằng Docker Compose

1. Bật Docker Desktop hoặc dịch vụ Docker daemon.
2. Xây dựng và khởi chạy toàn bộ stack:

   ```bash
   docker compose up --build
   ```

3. Truy cập gateway tại `http://localhost:3003`, các tuyến `/auth`, `/products`, `/orders` sẽ được proxy tới dịch vụ tương ứng.
4. Khi hoàn tất, dừng stack:

   ```bash
   docker compose down
   ```


## Kiểm thử

Chạy toàn bộ kiểm thử cấp dịch vụ với Mocha/Chai:

```bash
npm test
```

Có thể nhắm tới từng dịch vụ cụ thể:

```bash
npm test --prefix auth
npm test --prefix product
npm test --prefix order
```

## Quy trình CI/CD

GitHub Actions sử dụng file cấu hình [`.github/workflows/ci.yml`](.github/workflows/ci.yml) cho mỗi lần push hoặc mở pull request:

1. Checkout mã nguồn và thiết lập Node.js 18 (kèm bộ nhớ đệm npm).
2. Cài đặt phụ thuộc và chạy kiểm thử (`npm ci && npm test`).
3. Build Docker image cho từng dịch vụ để phát hiện lỗi Dockerfile.
4. Khi push lên `main`/`master`, đăng nhập Docker Hub (qua secrets) và đẩy image đã gắn tag.

Bạn có thể kích hoạt thủ công hoặc theo dõi trạng thái tại tab **Actions** trên GitHub. Badge CI ở đầu README phản ánh lần chạy gần nhất.

## Khắc phục sự cố

- RabbitMQ có thể cần vài giây để sẵn sàng; điều chỉnh `RABBITMQ_CONNECT_DELAY_MS` nếu gặp lỗi kết nối ban đầu.
- Nếu build Docker không thể xác thực Docker Hub, hãy kiểm tra secrets `DOCKER_NAME` và `DOCKER_TOKEN`.
- Xoá thư mục `node_modules` trước khi rebuild container nếu gặp lỗi phụ thuộc native.

## Giấy phép

Dự án được phân phối theo [Giấy phép ISC](LICENSE).

## Đóng góp

Mọi góp ý và pull request đều được hoan nghênh! Vui lòng mô tả thay đổi, đảm bảo kiểm thử chạy thành công và đính kèm kết quả CI liên quan.
