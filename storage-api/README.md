# Giới thiệu

Project này cung cấp các services lưu trữ và truy vấn các thực thể và quan hệ trích xuất từ các bài báo mạng. Các services được viết bằng [Node.js](https://nodejs.org/en), bao gồm:
- ...
- ...
- ...
- ...
- ...
- ...

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
docker build -t storage-api .
```
Trong đó, storage-api là tên image.

Lưu ý: các tham số trong file .env sẽ được build vào trong image.


## Run image
Sau khi build image, thực thi lệnh sau
```
docker run -p 3001:3001 -d --name storage-api-container storage-api
```

Nếu muốn đổi tham số (địa chỉ server neo4j, neo4j account, chế độ single/cluster) mà không muốn build lại image, làm theo 2 bước sau đây:

* Tạo file ```env.list``` với đầy đủ giá trị mới cho các tham số<br>
* Thêm tham số ```--env-file``` vào lệnh run image, ví dụ như:
```
docker run -p 3001:3001 -d --name --env-file env.list storage-api-container storage-api
```
