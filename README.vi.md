# Giới thiệu

Project này xây dựng hệ thống lưu trữ và truy vấn các thực thể và quan hệ trích xuất từ các bài báo mạng.
Số lượng thực thể và quan hệ có thể lên đến hàng chục tỷ, dựa trên công nghệ đồ thị tri thức [Neo4j](https://neo4j.com/).
Mô hình dữ liệu, các node, label, relationship, properties đã được thiết kế tối ưu.

Các tài nguyên quan trọng trong project:

**1. neo4j administration** Hướng dẫn quản trị hệ thống lưu trữ và truy vấn thực thể quan hệ, bao gồm cài đặt Neo4j, sao lưu (backup), và khôi phục (restore) dữ liệu trong quá trình hoạt động. Neo4j có thể được cài đặt trên các nền tảng Mac, Win, Linux, hoặc được cài đặt với Docker. Với yêu cầu cao về hiệu năng, có thể triển khai hệ thống dưới dạng [Causal Cluster](https://neo4j.com/docs/operations-manual/current/clustering/).

**2. storage-api** Project chính, viết bằng Node.js, cung cấp API cho developers giao tiếp với hệ thống lưu trữ và truy vấn thực thể quan hệ. API được cung cấp dưới dạng Restful services. Tổng cộng có ** services, phục vụ cho việc lưu trữ và truy vấn các thực thể quan hệ

**3. storage-api-docs** ReactJS Project cung cấp tài liệu hướng dẫn chi tiết và trực quan cho các services cung cấp trong project **storage-api**. Lập trình viên có thể test trực quan các services trong project này.

**4. storage-data-simulation** Project viết bằng Node.js, dùng để sinh dữ liệu tự động, cho phép đánh giá hiệu năng hệ thống. Dữ liệu được sinh ra dưới định dạng CSV, tùy theo cấu hình về số lượng thực thể và quan hệ giữa chúng. Các file CSV sau đó có thể được import vào cơ sở dữ liệu Neo4j. Cách làm này cho phép tạo lượng dữ liệu rất lớn trong thời gian ngắn, phục vụ cho việc kiểm thử hiệu năng hệ thống.

# Lưu ý

Để tăng tốc độ truy vấn, cần đánh index cho CSDL Neo4j. Cách làm như sau:

...
