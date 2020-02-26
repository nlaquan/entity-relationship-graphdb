# Giới thiệu

Project này cung cấp tài liệu mô tả hoạt động và giao diện minh họa sử dụng các services được cài đặt trong project **storage-api**. Project được viết bằng [ReactJS](https://reactjs.org/)

# Cài đặt
- Download project
- Mở terminal, cd vào thư mục project đã download
- Chạy lệnh `npm install` để cài đặt các thư viện cần thiết (hoặc lệnh `yarn install`)
- Chỉnh sửa các tham số cấu hình trong file .env
- Chạy lệnh `npm start` để kích hoạt project (hoặc lệnh `yarn start`)

# Chạy project với Docker

## Build image
Để build docker image, thực hiện lệnh sau
```
docker build -t storage-api-docs .
```
Trong đó, storage-api-docs là tên image.

Lưu ý: các tham số trong file .env sẽ được build vào trong image.


## Run image
Sau khi build image, thực thi lệnh sau
```
docker run -p 3002:3002 -d --name storage-api-docs-container storage-api-docs
```

Nếu muốn đổi tham số (địa chỉ cài đặt các services) mà không muốn build lại image, làm theo 2 bước sau đây:

* Tạo file ```env.list``` với giá trị mới cho tham số<br>
* Thêm tham số ```--env-file``` vào lệnh run image, ví dụ như:
```
docker run -p 3002:3002 -d --name --env-file env.list storage-api-docs-container storage-api-docs
```
