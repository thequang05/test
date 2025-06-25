## Tuần 1

Tuần này chúng ta sẽ học những kiến thức cơ bản với các chủ đề sau:

* PostgreSQL
* Terraform
* Docker
* Google Cloud Platform

---

### Docker & Postgres

1. Nhiệm vụ đầu tiên là tạo một `Dockerfile` dùng để build Docker image của chúng ta.

  Dockerfile là một tài liệu văn bản. Nó chứa tất cả các lệnh mà bạn có thể gọi trên dòng lệnh để tạo ra một Docker image. Nói cách khác, Docker có thể tự động build image bằng cách đọc các chỉ dẫn từ Dockerfile.

## Docker image là gì?

  Hãy tưởng tượng nó như một bản thiết kế... một bản thiết kế để tạo ra Docker container. Container là một gói phần mềm độc lập, nhẹ, có thể thực thi, chứa mọi thứ cần thiết để chạy một ứng dụng.

  Hiện tại, Dockerfile của chúng ta sẽ chỉ định một `parent image` (trong trường hợp này là Python) mà tất cả các lệnh tiếp theo sẽ dựa trên đó. Dockerfile cũng chỉ định các package Python sẽ được cài đặt. Nó cũng copy một file pipeline Python (xem bước tiếp theo) vào hệ thống file của container. Ngoài ra, nó sẽ chạy file này khi container được tạo ra.

2. Tiếp theo, chúng ta tạo file `pipeline.py` sẽ được chạy khi chúng ta chạy image để tạo container.

3. Sau đó, tôi thiết lập một môi trường ảo Python và cài đặt `pgcli` trong thư mục chính. Đây là một giao diện dòng lệnh cho Postgres.

4. Tiếp theo, chúng ta chạy một image `postgres` bằng lệnh dưới đây để tạo một container nơi chúng ta có thể làm việc với PostgreSQL.

  Lưu ý chúng ta dùng `docker run -it`. Tuỳ chọn này đảm bảo chúng ta có thể huỷ việc tạo container nếu muốn. Phần đầu tiên `docker run` tạo một container từ image đã cho và khởi động container đó. Nếu image chưa có trên hệ thống, nó sẽ được tải về từ registry.

  Bạn có thể thấy bên dưới chúng ta truyền vào một số tuỳ chọn và tham số như `-e`, `-v`... Tên image là `postgres:13` sẽ được tải về từ registry.

  ```
  docker run -it \
    -e POSTGRES_USER="root" \
    -e POSTGRES_PASSWORD="root" \
    -e POSTGRES_DB="ny_taxi" \
    -v $(pwd)/ny_taxi_postgres_data:/var/lib/postgresql/data \
    -p 5431:5432 \
    postgres:13
  ```

  * -e POSTGRES_USER : Tên user của PostgreSQL
  * -e POSTGRES_PASSWORD : Mật khẩu cho user
  * -e POSTGRES_DB : Tên database muốn tạo
  * -v : Chỉ định một volume bên ngoài. Mặc định, postgres sẽ tạo database trong một thư mục bên trong container, thư mục này sẽ biến mất khi container bị xoá. Tuy nhiên, ở đây chúng ta mount một volume, tức là thư mục bên trong container sẽ được đồng bộ với thư mục bên ngoài mà ta chỉ định. Điều này giúp dữ liệu được lưu trữ lâu dài dù container có bị xoá.
  * -p 5431:5432 : Map port postgres trên máy host với port trong container. Ở đây port 5432 đã được dùng trên máy tôi nên tôi dùng 5431.

---

Tôi thực sự đã gặp một số vấn đề với bước này. Cuối cùng tôi đã xoá thư mục `ny_taxi_postgres_data` khỏi thư mục làm việc hiện tại sau khi nó được tạo ra. Sau đó tôi tạo lại thư mục này và chỉnh quyền truy cập bằng lệnh:

`sudo chmod a+rwx ny_taxi_postgres_data`

Tôi tin rằng lệnh này cấp quyền đọc, ghi và thực thi cho thư mục.

Sau đó tôi chắc chắn đã chỉ định port `-p 5431:5432` và chạy image.

---

5. Tiếp theo, tôi kết nối tới database mới bằng công cụ dòng lệnh postgres đã cài đặt trước đó. Tôi chỉ định port postgres, tên database, user và localhost làm host - chỉ để kiểm tra mọi thứ hoạt động ổn và chúng ta có thể tương tác với database hiện tại (đang trống).

  `pgcli -h localhost -p 5431 -u root -d ny_taxi`

6. Tiếp theo tôi tạo một file Jupyter Notebook, sẽ viết bằng VS Code. Chúng ta sẽ dùng nó để nạp dữ liệu CSV vào database.

7. Chúng ta cần tải về dữ liệu sẽ làm việc (dạng CSV). Ở đây là bộ dữ liệu 2021 Yellow Taxi Trip Records tại [đây](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page). Chúng ta có thể copy link và chạy lệnh sau để tải về thư mục hiện tại. Lệnh `wget` là một công cụ tải dữ liệu qua mạng.

  `wget https://s3.amazonaws.com/nyc-tlc/trip+data/yellow_tripdata_2021-01.csv`

8. Ở bước này, chúng ta viết script jupyter notebook `upload-data`. Script này kết nối tới database, đọc file CSV (theo từng phần nhỏ) vào pandas dataframe, tạo bảng trong database và thêm dữ liệu CSV vào database theo từng phần.

9. Tiếp theo tôi cài đặt `pgadmin`. Đây là một cách để chúng ta tương tác với database qua giao diện web thân thiện hơn. Tôi đã cài sẵn pgadmin. Nhưng chúng ta cũng có thể chạy pgadmin bằng docker container. Chỉ cần đảm bảo postgres và pgadmin cùng nằm trong một `network` - và đặt tên cho cả hai trong network đó. Điều này giúp chúng ta kết nối tới postgres engine, và do đó là database, từ pgadmin.

  Đây là cách sửa lệnh `docker run` cho postgres để thêm vào network và đặt tên. Đầu tiên tạo network:

  `docker network create pg-network`

  Sau đó chạy container postgres:

  ```
  docker run -it \
  -e POSTGRES_USER="root" \
  -e POSTGRES_PASSWORD="root" \
  -e POSTGRES_DB="ny_taxi" \
  -v $(pwd)/ny_taxi_postgres_data:/var/lib/postgresql/data \
  -p 5431:5432 \
  --network=pg-network \
  --name pg-database-2 \
  postgres:13
  ```

  Đây là cách cài đặt pgadmin. Lưu ý cả hai đều cùng network:

  ```
  docker run -it \
  -e PGADMIN_DEFAULT_EMAIL="admin@admin.com" \
  -e PGADMIN_DEFAULT_PASSWORD="root" \
  -p 8080:80 \
  --network=pg-network \
  --name pgadmin-2 \
  dpage/pgadmin4
  ```

  * -e PGADMIN_DEFAULT_EMAIL = email dùng để đăng nhập pgadmin
  * -e PGADMIN_DEFAULT_PASSWORD = mật khẩu đăng nhập pgadmin
  * -p 8080:80 = như với postgres, chúng ta map port pgadmin với máy host.

10. Khi chạy cả hai ở hai terminal khác nhau, chúng ta đã tạo hai container.

 Để truy cập pgadmin, vào `localhost:8080` trên trình duyệt, dùng thông tin đăng nhập pgadmin. Đảm bảo chỉ định `pg-database-2` làm host name khi kết nối.

11. Tiếp theo, tôi hoàn thiện script pipeline nạp dữ liệu, giờ tên là `ingest-data` và chuyển nó thành script python (thay vì jupyter notebook).

Script này chưa hoàn hảo, sẽ sửa sau. Nó được viết để khi chạy image tạo container, chúng ta có thể truyền tham số như tên bảng, thông tin postgres, v.v. Thông thường, mật khẩu và user sẽ được đặt qua biến môi trường, và nạp vào. Nhưng hiện tại chưa cần lo lắng về điều đó.

Dockerfile của chúng ta giờ sẽ chạy script nạp dữ liệu này, cũng như cài đặt các dependency cần thiết.

12. Tóm tắt nhanh:

Chúng ta có thể dừng tất cả container bằng lệnh sau. Tôi nhận thấy nếu không xoá container đã dừng, có thể phát sinh lỗi. Nếu đã dừng container và không cần nữa, chạy lệnh sau:

`docker rm $(docker ps --filter status=exited -q)`

Lệnh này in ra ID của tất cả container đã dừng và xoá chúng.

Liệt kê tất cả container:

`docker ps -a`

Liệt kê container đang chạy:

`docker ps`

Muốn dừng container đang chạy:

`docker stop <containerID>`

Muốn xoá container:

`docker rm <containerID>`

Bây giờ cùng chạy lại các bước.

Chạy lệnh sau để tạo container postgres 13:

```
docker run -it \
  -e POSTGRES_USER="root" \
  -e POSTGRES_PASSWORD="root" \
  -e POSTGRES_DB="ny_taxi" \
  -v $(pwd)/ny_taxi_postgres_data:/var/lib/postgresql/data \
  -p 5431:5432 \
  --network=pg-network \
  --name pg-database-2 \
  postgres:13
  ```

Sau đó chạy lệnh sau để tạo container pgadmin:

```
docker run -it \
  -e PGADMIN_DEFAULT_EMAIL="admin@admin.com" \
  -e PGADMIN_DEFAULT_PASSWORD="root" \
  -p 8080:80 \
  --network=pg-network \
  --name pgadmin-2 \
  dpage/pgadmin4
```

13. Bây giờ chúng ta có thể tạo image bằng lệnh:

`docker build -t taxi_ingest:v001 .`

Lệnh này build image từ Dockerfile. Dấu `.` chỉ thư mục hiện tại (nơi chứa Dockerfile). Tham số `-t` để đặt tag cho image, ở đây là `001`.

Sau khi build xong, chúng ta đã có bản thiết kế cho container.

14. Bây giờ chạy lệnh sau:

```
docker run -it  \
    --network=pg-network \
    taxi_ingest:v001 \
      --user=root \
      --password=root \
      --host=pg-database-2 \
      --port=5432 \
      --db=ny_taxi \
      --table_name=yellow_taxi_data \
      --url="https://s3.amazonaws.com/nyc-tlc/trip+data/yellow_tripdata_2021-01.csv"
```

Ở đây chúng ta chạy image để tạo container.

Chúng ta cũng truyền nhiều tham số khác như `user`, `password` và `url` nơi dữ liệu sẽ được tải về. Chương trình python `argparse` sẽ đọc các tham số này vào script `ingest-data`.

Bây giờ, mỗi khi chạy container này, chúng ta sẽ có một database chứa dữ liệu CSV - có thể truy cập qua pgadmin.

15. Nhưng... như vậy vẫn hơi bất tiện. Hãy đơn giản hoá bằng cách dùng `docker-compose`. Công cụ này đi kèm với docker desktop, đã được cài đặt.

16. Đầu tiên tạo file `YAML` (YAML là ngôn ngữ thường dùng cho file cấu hình).

Ở đây chúng ta chỉ định hầu hết các thông tin như khi chạy lệnh build cho pgadmin và postgres, chỉ khác về định dạng. Không cần chỉ định network (docker sẽ tự tạo). Chúng ta cũng dùng tên service để kết nối postgres từ pgadmin thay vì tên đặt khi build.

Đây là cách tiện lợi để tạo nhiều container từ nhiều image.

Để chạy file này, dùng:

`docker-compose up`

Để tắt container, dùng lệnh sau trong thư mục đã chạy lệnh trước:

`docker-compose down`

Có thể chạy container ở chế độ detached (giải phóng terminal nhưng container vẫn chạy):

`docker-compose up -d`

Tôi từng mắc lỗi ở bước này trong một lần commit trước, chỉ nhận ra khi bắt đầu phiên làm việc mới hôm sau. Tôi đã nói:

`Chúng ta chỉ định pg-network để đảm bảo container này thuộc network đó. Nhớ là đã tạo network này khi tạo container postgres và pgadmin.`

Tôi nghĩ điều này không đúng. Khi chạy `docker-compose` - hai service trong file YAML sẽ tự động nằm cùng một network, docker sẽ đặt tên mặc định (có thể chỉ định tên nếu muốn). `pg-network` không còn liên quan ở đây. Để tìm network mặc định, chạy:

`docker network ls`

Lệnh này in ra tất cả network đang chạy. Bạn sẽ thấy một network đại diện cho network chung của pgadmin và postgres. Trong trường hợp của tôi là `2_docker_sql_defaults` - tôi đã thêm vào lệnh dài ở trên.

Cũng cần thay `host` thành `pgdatabase` như đã chỉ định trong file YAML.

Vậy lệnh mới (sau khi chạy `docker-compose up`) sẽ như sau:

```
docker run -it  \
    --network=<default network created> \
    taxi_ingest:v001 \
      --user=root \
      --password=root \
      --host=pgdatabase \
      --port=5432 \
      --db=ny_taxi \
      --table_name=yellow_taxi_data \
      --url="https://s3.amazonaws.com/nyc-tlc/trip+data/yellow_tripdata_2021-01.csv"
```

Mọi thứ sẽ hoạt động ổn. 