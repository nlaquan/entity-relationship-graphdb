# Hướng dẫn cài đặt triển khai CSDL thực thể-quan hệ trên Neo4j
Hướng dẫn này được viết cho Neo4j phiên bản 3.5

## 1 Nội dung
* [Cài đặt](#2-cài-đặt)
* [Sao lưu](#3-sao-lưu)
* [Khôi phục](#4-khôi-phục)

## 2 Cài đặt
### 2.1 Standalone/Single Database
Trước hết, bạn cần tải file cài đặt (file tar với Linux/Mac, zip với Windows) từ trang download của [Neo4j](https://neo4j.com/download-center/#community). Đây là phiên bản miễn phí - community edition. Ngoài ra còn có một phiên bản trả phí (enterprise edition). Chọn phiên bạn Neo4j phù hợp với hệ thống của bạn và bấm nút Download. Sau khi tải về file cài đặt về, thực hiện lần lượt các bước cài đặt dưới đây cho cả hai phiên bản.

* **Bước 1**: <br>
Sao chép file đã tải về tới thư mục bất kỳ và giải nén. Ví dụ:
```$ tar -xf neo4j-enterprise-3.5.8-unix.tar.gz```

* **Bước 2**: <br>
Di chuyển đến thư mục Neo4j vừa giải nén, rồi start Neo4j như sau:<br>
```cd neo4j-enterprise-3.5.8```<br>
```./bin/neo4j start```

### 2.2 Casual Cluster
Triển khai Casual Cluster giúp Neo4j có thể hoạt động an toàn và hiệu quả hơn với dữ liệu lớn. Tài liệu đầy đủ: https://neo4j.com/docs/operations-manual/current/clustering/. Một cluster bao gồm các Core Servers và các Read Replicas.

#### a. Tham số cấu hình
Khi triển khai Casual Cluster, cần chú ý tới các tham số cấu hình chính sau đây
| Tham số | Mô tả |
| --- | --- |
| dbms.default_listen_address | Địa chỉ hoặc giao diện mạng mà máy sử dụng để lắng nghe request tới. Đặt giá trị này là `0.0.0.0` để gắn tới bất kì giao diện mạng nào có sẵn |
| dbms.default_advertised_address | Địa chỉ để các máy khác thực hiện kết nối tới. Thông thường, đây là địa chỉ IP hoặc domain |
| dbms.mode | Chế độ hoạt động của một single server instance. Trong chế độ Cluser, tham số này có 2 giá trị là: CORE hoặc READ_REPLICA |
| causal_clustering.minimum_core_cluster_size_at_formation | Số lượng máy nhỏ nhất trong cụm tại thời điểm thực hiện khởi tạo cluser. Một cluser sẽ không thể khởi tạo thành công nếu không xác định tham số này. Giá trị mặc định là `3` và giá trị nhỏ nhất có thể đặt là `2` |
| causal_clustering.minimum_core_cluster_size_at_runtime | Số lượng core instance nhỏ nhất sẽ tồn tại trong cụm tại thời điểm runtime |
| causal_clustering.initial_discovery_members | Danh sách địa chỉ mạng (IP/domain) của các máy để khởi tạo nên Cluster, thường được phân tách với nhau bởi sau phẩy và cổng mặc dịnh là :5000 |

Ví dụ dưới đây minh hoạ việc cài đặt một cụm (Casual Cluster) với 3 máy Core. Trong ví dụ này, 3 máy core lần lượt có domain tương ứng là: `core01.example.com`, `core02.example.com` và `core03.example.com`. Neo4j Enterprise Edition đã được cài đặt trên cả 3 máy. Các cấu hình được chỉnh sửa trong file `neo4j.conf` có sẵn trong thư mục Neo4j đã cài đặt.

Trong file `neo4j.conf` trên máy có domain `core01.example.com`, thêm đoạn cấu hình sau:
```
dbms.connectors.default_listen_address=0.0.0.0
dbms.connectors.default_advertised_address=core01.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.initial_discovery_members=core01.example.com:5000,core 02.example.com:5000,core03.example.com:5000
```

Trong file `neo4j.conf` trên máy có domain `core02.example.com`, thêm đoạn cấu hình sau:
```
dbms.connectors.default_listen_address=0.0.0.0
dbms.connectors.default_advertised_address=core02.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.initial_discovery_members=core01.example.com:5000,core 02.example.com:5000,core03.example.com:5000
```

Trong file `neo4j.conf` trên máy có domain `core03.example.com`, thêm đoạn cấu hình sau:
```
dbms.connectors.default_listen_address=0.0.0.0
dbms.connectors.default_advertised_address=core03.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.initial_discovery_members=core01.example.com:5000,core 02.example.com:5000,core03.example.com:5000
```
Lúc này, các máy cần được khởi chạy để tạo nên cluster. Thứ tự khởi chạy các máy là không quan trọng.<br>
Sau khi cluster khởi chạy thành công, chạy câu lệnh `sysinfo` trên [neo4j browser](http://localhost:7474) để kiểm tra trạng thái của cluster.

#### b. Thêm một Core vào cụm đã tồn tại
Core server được thêm vào cụm đã tồn tại bằng cách khởi chạy một Neo4j instance mới với các tham số cấu hình thích hợp.<br>
Tham số `causal_clustering.initial_discovery_members` sẽ được cập nhật trên tất cả các máy trong cụm. <br>
Trong ví dụ dưới đây, một core server với domain `core04.example.com` sẽ được thêm vào cụm mà đã được tạo trong chương [Configuration](#configuration).<br>
Trong file `neo4j.conf` trên máy có domain `core04.example.com` có nội dung sau:
```
dbms.default_listen_address=0.0.0.0
dbms.default_advertised_address=core04.example.com
dbms.mode=CORE
causal_clustering.minimum_core_cluster_size_at_formation=3
causal_clustering.minimum_core_cluster_size_at_runtime=3
causal_clustering.discovery_members=core01.example.com:5000,core02.example.com:5000,core03.example.com:5000,core04.example.com:5000
```
Tiếp đến, ta chạy Core server này để nó tự thêm vào trong cụm Casual Cluster

#### c. Thêm một Read Replica vào cụm đã tồn tại
Trong ví dụ này, một Read Replica với domain *replica01.example.com* sẽ được thêm vào cụm đã tạo trong chương [Configuration](#configuration). Trong file `neo4j.conf` trên máy có domain `replica01.example.com` có nội dung sau
```
dbms.mode=READ_REPLICA
causal_clustering.discovery_members=core01.example.com:5000,core02.example.com:5000,core03.example.com:5000
```

Lúc này chỉ cần khởi chạy Read Replica để nó tự thêm vào trong cụm Casual Cluster, sau đó chạy câu lệnh `sysinfo` trên [neo4j browser](http://localhost:7474) để kiểm tra trạng thái của cluster.

## 3 Sao lưu
Trong Neo4j có hai kiểu sao lưu là online và offline. Sao lưu offline yêu cầu phải tắt các Neo4j instances trước khi thực hiện. Sao lưu online không yêu cầu như vậy.<br>
Để biết thêm thông tin về sao lưu offline, tham khảo thêm ở [Dump and load databases](https://neo4j.com/docs/operations-manual/3.5/tools/dump-load/).<br>
Các nội dung dưới đây chỉ nói về sao lưu online.

### 3.1 Standalone database
Tham khảo thêm trên trang: https://neo4j.com/docs/operations-manual/3.5/backup/standalone/

#### a. Tham số cấu hình
Bảng dưới đây liệt kê ra các tham số liên quan đến thực hiện sao lưu. Những tham số này được ghi trong file `neo4j.conf`<br>
| Tham số | Giá trị mặc định | Mô tả |
| --- | --- | --- |
| dbms.backup.enabled | true | Cho phép thực hiện sao lưu hoặc không |
| dbms.backup.address | 127.0.0.1:6362-6372 | Địa chỉ IP/domain của máy lắng nghe yêu cầu sao lưu |

#### b. Quy trình thực hiện sao lưu online
Quy trình thực hiện sao lưu online gồm 2 bước sau<br>
1. Backup server cần được cấu hình với các tham số như trong bảng trên.
2. Từ một máy khác - gọi là backup client, đã cài đặt Neo4j, bật terminal và di chuyển đến thư mục cài đặt Neo4j, thực hiện câu lệnh `neo4j-admin backup`. Dữ liệu được sao lưu sẽ được lưu trên backup client.

#### c. Câu lệnh sao lưu online
Cú pháp
```
neo4j-admin backup --backup-dir=<backup-path> --name=<graph.db-backup>
                    [--from=<address>] [--protocol=<any|catchup|common>]
                    [--fallback-to-full[=<true|false>]]
                    [--pagecache=<pagecache>]
                    [--timeout=<timeout>]
                    [--check-consistency[=<true|false>]]
                    [--additional-config=<config-file-path>]
                    [--cc-graph[=<true|false>]]
                    [--cc-indexes[=<true|false>]]
                    [--cc-label-scan-store[=<true|false>]]
                    [--cc-property-owners[=<true|false>]]
                    [--cc-report-dir=<directory>]
```
Một số tuỳ chọn quan trọng trong cú pháp trên:<br>

| Tuỳ chọn | Giá trị mặc định | Mô tả |
| --- | --- | --- |
| protocol | any | Giao thức thực hiện sao lưu. Nếu tuỳ chọn này được đặt là `any` thì `cachup` sẽ được sử dụng trước. Nếu không thành công, quá trình sao lưu sẽ thử tuỳ chọn này với giá trị `common`. Giá trị này nên được cài đặt rõ rang. Đặt là `catchup` cho việc sao lưu cho cụm, và `common` cho việc sao lưu cho single database |
| backup-dir | | Thư mục mà dữ liệu sao lưu sẽ được lưu |
| name | | Tên của bản sao lưu |
| from | localhost:6362 | Địa chỉ IP/domain của backup server (có thể xác định port) |

Chi tiết tất cả các tùy chọn được trình bày chi tiết tại [neo4j docs](https://neo4j.com/docs/operations-manual/3.5/backup/performing/)

#### d. Ví dụ
Giả sử backup server được cấu hình với tham số sau:
```
dbms.backup.enabled=true
dbms.backup.address=example.server.com
```
Trên backup client, di chuyển tới thư mục cài đặt Neo4j và chạy câu lệnh sau trên terminal:
```
neo4j-admin backup
  --protocol=any
  --from=example.server.com
  --backup-dir=03/02/2020
  --name=graph.db-graph
```

### 3.2 Sao lưu Causal Clusters
#### a. Tham số cấu hình
Bảng dưới đây liệt kê ra các tham số liên quan đến thực hiện sao lưu. Những tham số này được ghi trong file `neo4j.conf`<br>
| Tham số | Giá trị mặc định | Mô tả |
| --- | --- | --- |
| dbms.backup.enabled | true | Cho phép thực hiện sao lưu hoặc không |
| dbms.backup.address | 127.0.0.1:6362-6372 | Địa chỉ IP/domain của máy lắng nghe yêu cầu sao lưu. |
| dbms.backup.backup_policy |  | SSL policy được sử dụng trên backup port |

#### b. Sao lưu được mã hoá
Sao lưu được mã hoá có thể được áp dụng với cụm. Cả backup client và backup server cần phải được cấu hình với cùng một SSL policy.
Xem phần [Intra-cluster encryption](https://neo4j.com/docs/operations-manual/3.5/clustering/intra-cluster-encryption/) để biết thêm chi tiết.
Quy trình thực hiện các bước sao lưu đối với từng core trong cụm tương tự như khi thực hiện sao lưu với single database.

## 4 Khôi phục
### 4.1 Câu lệnh khôi phục
Cú pháp
```
neo4j-admin restore --from=<backup-directory> [--database=<name>] [--force[=<true|false>]]
```
Tuỳ chọn

| Tuỳ chọn | Giá trị mặc định | Mô tả |
| --- | --- | --- |
| --from | | Đường dẫn đến thư mục chứa dữ liệu sao lưu |
| --database | neo4j | Tên của database cần khôi phục |
| --force | | Nếu database đã tồn tại, cho phép đặt ghi đè |

### 4.2 Khôi phục dữ liệu cho single database
Thực hiện các bước sau:
1. Tắt Neo4j instance đang chạy
2. Chạy câu lệnh `neo4j-admin` nói trên
3. Khởi chạy lại Neo4j instance

**Ví dụ**: Khôi phục database từ thư mục có đường dẫn `/backup/2019_12_10/graph.db-backup`.
Đầu tiên, di chuyển đến thư mục cài đặt Neo4j. Sau đó, thực hiện các câu lệnh sau:
```
./bin/neo4j stop
./bin/neo4j-admin restore --from=/backup/2019_12_10/graph.db-backup --database=neo4j --force
./bin/neo4j start
```

### 4.3 Khôi phục cho cluster
Để thực hiện khôi phục cho một cụm, các máy trong cụm cần phải được tách rời nhau bằng việc sử dụng câu lệnh `neo4j-admin unbind`
Ví dụ, để unbind một máy core trong Core Server, chạy câu lệnh sau:
```
neo4j-admin unbind
```
Để khôi phục dữ liệu cho một cụm, thực hiện các bước sau:
1. Tắt tất cả Neo4j instance trên các máy trong cụm.
2. Chạy câu lệnh `neo4j-admin unbind` đối với mỗi máy trong cụm
3. Thực hiện khôi phục dữ liệu trên mỗi máy trong cụm bằng câu lệnh `neo4j-admin restore`
4. Khởi chạy lại toàn bộ các Neo4j instance.

