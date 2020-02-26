# Giới thiệu

Project này cho phép sinh lượng cực lớn dữ liệu mô phỏng các thực thể và quan hệ trích xuất từ các bài báo mạng. Dữ liệu được sinh ra dưới định dạng CSV, tùy theo cấu hình cho trước về số lượng thực thể và quan hệ muốn sinh. Các file CSV sau đó có thể được import vào cơ sở dữ liệu Neo4j. Cách làm này cho phép tạo lượng dữ liệu rất lớn trong thời gian ngắn, phục vụ cho việc kiểm thử hiệu năng hệ thống

# Cài đặt

- Download project
- Mở terminal, cd vào thư mục project đã download
- Chạy lệnh `npm install` để cài đặt các thư viện cần thiết (hoặc lệnh `yarn install`)

# Sinh dữ liệu mô phỏng

Chạy lệnh sau để sinh dữ liệu mô phỏng
```
node src/index path/to/configuration/file
```
Một số file cấu hình tạo trước có thể được tham khảo trong thư mục `src`

Sau khi kết thúc lệnh, trong thư mục hiện tại sẽ có thư mục con là thư mục `import`, chứa tập các file CSV đặc tả các thực thể và các quan hệ cần sinh. Kích thước các file CSV đã được tối ưu hóa, giúp tăng tốc độ khi import vào CSDL Neo4j. Đồng thời, file `script.sh` được sinh tự động trong thư mục import, sẽ được gọi đến để import các file CSV vào CSDL Neo4j.

# Import dữ liệu vào Neo4j

Lưu ý: Chỉ được import khi DB rỗng, vừa được tạo, không được chứa bất kỳ dữ liệu gì. Và không được start Neo4j khi chạy lệnh import.

Để import các file CSV đã sinh vào Neo4j, thực hiện các bước sau đây:
- Copy tất cả các thư mục con của thư mục `import` vừa sinh vào trong thư mục `import` của Neo4j
- Copy file ```script.sh``` vào thư mục Neo4j
- Mở terminal, vào trong thư mục Neo4j, thực hiện lệnh ```chmod +x script.sh```
- Sau cùng, thực thi script bằng lệnh sau ```./script.sh```. Dữ liệu sẽ được import vào CSDL default của Neo4j
