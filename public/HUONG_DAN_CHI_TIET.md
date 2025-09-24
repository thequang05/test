# 🎾 HƯỚNG DẪN VIẾT PROJECT TENNIS ANALYSIS TỪ ĐẦU

## 📋 KẾ HOẠCH TỔNG THỂ

### Bước 1: Phân tích yêu cầu
- Input: Video tennis
- Output: Video với thống kê (tốc độ bóng, tốc độ người chơi, số cú đánh)
- Cần phát hiện: 2 người chơi, bóng tennis, keypoints sân tennis

### Bước 2: Thiết kế kiến trúc
```
Video Input → Object Detection → Tracking → Coordinate Conversion → Statistics → Video Output
```

---

## 🏗️ CẤU TRÚC PROJECT

### 1. **utils/video_utils.py**
**Chức năng**: Xử lý video cơ bản
- `read_video()`: Đọc video thành danh sách frames
- `save_video()`: Lưu frames thành video output
- `resize_video()`: Thay đổi kích thước video

### 2. **trackers/player_tracker.py**
**Chức năng**: Phát hiện và tracking người chơi
- `__init__()`: Khởi tạo YOLO model
- `detect_frame()`: Phát hiện người trong 1 frame
- `track_players()`: Tracking ID cho người chơi
- `choose_players()`: Chọn 2 người gần sân nhất
- `draw_bboxes()`: Vẽ bounding box lên video

### 3. **trackers/ball_tracker.py**
**Chức năng**: Phát hiện và tracking bóng tennis
- `__init__()`: Khởi tạo fine-tuned YOLO model
- `detect_ball()`: Phát hiện bóng trong frame
- `interpolate_positions()`: Điền vị trí bóng bị mất
- `detect_ball_hits()`: Phát hiện thời điểm đánh bóng
- `calculate_ball_speed()`: Tính tốc độ bóng

### 4. **court_line_detector/court_line_detector.py**
**Chức năng**: Phát hiện keypoints sân tennis
- `__init__()`: Khởi tạo ResNet50 model
- `predict_keypoints()`: Phát hiện 14 keypoints
- `draw_keypoints()`: Vẽ keypoints lên video
- `create_court_coordinates()`: Tạo hệ tọa độ sân

### 5. **mini_court/mini_court.py**
**Chức năng**: Chuyển đổi tọa độ và tạo mini court
- `__init__()`: Khởi tạo với frame đầu tiên
- `convert_to_mini_court()`: Chuyển pixel sang tọa độ mini court
- `pixel_to_meters()`: Chuyển pixel sang mét thật
- `draw_mini_court()`: Vẽ mini court lên video
- `draw_positions()`: Vẽ vị trí người chơi và bóng

### 6. **utils/conversions.py**
**Chức năng**: Chuyển đổi đơn vị đo
- `pixel_to_meters()`: Chuyển pixel sang mét
- `calculate_distance()`: Tính khoảng cách giữa 2 điểm
- `calculate_speed()`: Tính tốc độ (m/s → km/h)

### 7. **utils/bbox_utils.py**
**Chức năng**: Xử lý bounding box
- `get_center()`: Lấy tâm của bounding box
- `get_height()`: Lấy chiều cao bounding box
- `calculate_bbox_area()`: Tính diện tích bounding box

### 8. **constants/__init__.py**
**Chức năng**: Lưu các hằng số
- Kích thước sân tennis thật (mét)
- Chiều cao trung bình người chơi
- FPS của video

### 9. **main.py**
**Chức năng**: File chính điều phối toàn bộ
- Khởi tạo các tracker và detector
- Xử lý video frame by frame
- Tính toán thống kê
- Vẽ kết quả lên video
- Lưu video output

---

## 📝 QUY TRÌNH VIẾT CODE

### Phase 1: Setup cơ bản
1. Tạo cấu trúc thư mục
2. Cài đặt dependencies
3. Viết `video_utils.py` cơ bản
4. Test đọc/ghi video

### Phase 2: Object Detection
1. Viết `player_tracker.py` với YOLO
2. Test phát hiện người chơi
3. Viết `ball_tracker.py` với fine-tuned YOLO
4. Test phát hiện bóng tennis

### Phase 3: Court Detection
1. Viết `court_line_detector.py` với ResNet50
2. Test phát hiện keypoints sân tennis
3. Viết `mini_court.py` để chuyển đổi tọa độ

### Phase 4: Tracking & Statistics
1. Implement tracking algorithms
2. Viết functions tính tốc độ
3. Phát hiện ball hits
4. Tính toán thống kê

### Phase 5: Visualization
1. Vẽ bounding boxes
2. Vẽ mini court
3. Hiển thị thống kê real-time
4. Tạo video output

### Phase 6: Optimization
1. Tối ưu hiệu suất
2. Xử lý lỗi
3. Test với nhiều video khác nhau

---

## 🎯 CÁC HÀM QUAN TRỌNG CẦN VIẾT

### 1. **Player Detection & Tracking**
- `detect_persons_in_frame()`
- `assign_tracking_ids()`
- `filter_tennis_players()`
- `calculate_player_speed()`

### 2. **Ball Detection & Tracking**
- `detect_tennis_ball()`
- `track_ball_trajectory()`
- `detect_ball_hit_moments()`
- `calculate_ball_velocity()`

### 3. **Court Analysis**
- `detect_court_keypoints()`
- `establish_court_coordinate_system()`
- `map_pixel_to_court_position()`

### 4. **Statistics Calculation**
- `count_player_shots()`
- `calculate_average_speeds()`
- `track_player_movement()`
- `generate_match_statistics()`

### 5. **Visualization**
- `draw_player_boxes()`
- `draw_ball_trajectory()`
- `display_statistics_overlay()`
- `create_mini_court_view()`

---

## 🔧 CÔNG CỤ VÀ THƯ VIỆN CẦN DÙNG

### Core Libraries:
- **OpenCV**: Xử lý video và hình ảnh
- **PyTorch**: Deep learning models
- **Ultralytics**: YOLO models
- **NumPy**: Tính toán số học
- **Pandas**: Xử lý dữ liệu

### Models cần tải:
- **YOLOv8**: Player detection
- **Fine-tuned YOLO**: Tennis ball detection  
- **ResNet50**: Court keypoint detection

### Development Tools:
- **Jupyter Notebook**: Prototype và test
- **VS Code**: Viết code
- **Git**: Version control

---

## 📊 LUỒNG XỬ LÝ CHÍNH

### 1. **Input Processing**
- Đọc video → Chia thành frames
- Resize frames nếu cần
- Chuẩn bị models

### 2. **Detection Phase**
- Phát hiện người chơi (YOLO)
- Phát hiện bóng tennis (Fine-tuned YOLO)
- Phát hiện keypoints sân (ResNet50)

### 3. **Tracking Phase**
- Tracking ID cho người chơi
- Tracking trajectory bóng
- Interpolate missing detections

### 4. **Analysis Phase**
- Chuyển đổi tọa độ pixel → mét
- Tính tốc độ bóng và người chơi
- Phát hiện thời điểm đánh bóng
- Tính số cú đánh

### 5. **Output Generation**
- Vẽ bounding boxes
- Vẽ mini court
- Hiển thị thống kê
- Lưu video kết quả

---

## 🎓 KIẾN THỨC CẦN HỌC

### Computer Vision:
- Object Detection (YOLO)
- Keypoint Detection
- Video Processing
- Coordinate Transformation

### Deep Learning:
- Model Loading & Inference
- Transfer Learning
- Model Optimization

### Programming:
- Object-Oriented Programming
- Error Handling
- Code Organization
- Performance Optimization

---

## 🚀 BƯỚC ĐẦU TIÊN

1. **Tạo project structure**
2. **Cài đặt dependencies**
3. **Viết function đọc video đơn giản**
4. **Test với 1 frame**
5. **Dần dần thêm các component**

**Mục tiêu**: Từng bước xây dựng project hoàn chỉnh, học hỏi qua mỗi component!
