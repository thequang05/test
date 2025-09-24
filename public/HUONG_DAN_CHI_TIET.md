# 🎾 HƯỚNG DẪN LÀM PROJECT TENNIS ANALYSIS CHO NGƯỜI MỚI BẮT ĐẦU

## 📋 MỤC LỤC
1. [Giới thiệu về Project](#giới-thiệu-về-project)
2. [Chuẩn bị môi trường](#chuẩn-bị-môi-trường)
3. [Tải và cài đặt Models](#tải-và-cài-đặt-models)
4. [Hiểu cấu trúc Project](#hiểu-cấu-trúc-project)
5. [Chạy Project lần đầu](#chạy-project-lần-đầu)
6. [Giải thích từng component](#giải-thích-từng-component)
7. [Tối ưu hiệu suất](#tối-ưu-hiệu-suất)
8. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)
9. [Mở rộng Project](#mở-rộng-project)

---

## 🎯 GIỚI THIỆU VỀ PROJECT

### Project này làm gì?
- **Phân tích video tennis** để đo tốc độ bóng và người chơi
- **Đếm số cú đánh** của mỗi người chơi
- **Vẽ các thống kê** lên video output
- **Phát hiện tự động** người chơi, bóng tennis, và sân tennis

### Công nghệ sử dụng:
- **Computer Vision**: OpenCV, YOLO, ResNet50
- **AI/ML**: PyTorch, Ultralytics
- **Programming**: Python 3.8+

---

## 🛠️ CHUẨN BỊ MÔI TRƯỜNG

### Bước 1: Kiểm tra Python
```bash
python --version
# Cần Python 3.8 trở lên
```

### Bước 2: Tạo Virtual Environment
```bash
# Tạo môi trường ảo
python -m venv tennis_env

# Kích hoạt môi trường
# Trên macOS/Linux:
source tennis_env/bin/activate
# Trên Windows:
# tennis_env\Scripts\activate
```

### Bước 3: Cài đặt Dependencies
```bash
# Cài đặt các thư viện cần thiết
pip install ultralytics
pip install torch torchvision
pip install opencv-python
pip install pandas
pip install numpy
pip install gdown  # Để tải models từ Google Drive
```

### Bước 4: Kiểm tra cài đặt
```bash
python -c "import torch; print('PyTorch:', torch.__version__)"
python -c "import cv2; print('OpenCV:', cv2.__version__)"
python -c "import ultralytics; print('Ultralytics installed')"
```

---

## 📥 TẢI VÀ CÀI ĐẶT MODELS

### Bước 1: Tạo thư mục models
```bash
mkdir models
cd models
```

### Bước 2: Tải Tennis Ball Detection Model
```bash
# Model phát hiện bóng tennis (173MB)
gdown 1UZwiG1jkWgce9lNhxJ2L0NVjX1vGM05U -O yolo5_last.pt
```

### Bước 3: Tải Tennis Court Keypoint Model
```bash
# Model phát hiện keypoints sân tennis (90MB)
gdown 1QrTOF1ToQ4plsSZbkBs3zOLkVt3MBlta -O keypoints_model.pth
```

### Bước 4: Tải YOLOv8x Model (tự động)
```bash
# Model này sẽ được tải tự động khi chạy lần đầu
# Kích thước: ~200MB
```

### Bước 5: Kiểm tra models
```bash
ls -lh models/
# Kết quả mong đợi:
# -rw-r--r-- 1 user staff  90M date keypoints_model.pth
# -rw-r--r-- 1 user staff 165M date yolo5_last.pt
```

---

## 🏗️ HIỂU CẤU TRÚC PROJECT

```
tennis_analysis/
├── 📁 analysis/                 # Phân tích dữ liệu
├── 📁 constants/               # Hằng số (kích thước sân tennis)
├── 📁 court_line_detector/     # Phát hiện keypoints sân tennis
├── 📁 input_videos/           # Video đầu vào
├── 📁 mini_court/             # Chuyển đổi tọa độ mini court
├── 📁 models/                 # AI models
├── 📁 output_videos/          # Video kết quả
├── 📁 tracker_stubs/          # Dữ liệu đã xử lý sẵn
├── 📁 trackers/               # Player và Ball tracker
├── 📁 training/               # Code training models
├── 📁 utils/                  # Utilities (video, conversions)
├── 📄 main.py                 # File chính
└── 📄 yolo_inference.py       # Test YOLO riêng lẻ
```

### Giải thích từng thư mục:

#### 📁 **trackers/**
- `player_tracker.py`: Phát hiện và tracking người chơi
- `ball_tracker.py`: Phát hiện và tracking bóng tennis

#### 📁 **court_line_detector/**
- `court_line_detector.py`: Phát hiện 14 keypoints trên sân tennis

#### 📁 **utils/**
- `video_utils.py`: Đọc/ghi video
- `conversions.py`: Chuyển đổi pixel sang mét
- `bbox_utils.py`: Xử lý bounding box

#### 📁 **constants/**
- `__init__.py`: Kích thước thật của sân tennis (mét)

---

## 🚀 CHẠY PROJECT LẦN ĐẦU

### Bước 1: Chuẩn bị video input
```bash
# Đặt video tennis vào thư mục input_videos/
# Tên file: input_video.mp4
ls input_videos/
```

### Bước 2: Chạy project với stub data (nhanh)
```bash
# Chạy với dữ liệu đã xử lý sẵn (không cần chạy AI models)
python main.py
```

**Lưu ý**: Project sẽ tự động sử dụng stub data nếu có sẵn, giúp chạy nhanh hơn.

### Bước 3: Kiểm tra kết quả
```bash
# Xem video output
ls output_videos/
# File: output_video.avi
```

### Bước 4: Chạy với AI models thật (chậm hơn)
```python
# Sửa trong main.py:
player_detections = player_tracker.detect_frames(video_frames,
                                                 read_from_stub=False,  # Thay đổi thành False
                                                 stub_path="tracker_stubs/player_detections.pkl"
                                                 )
ball_detections = ball_tracker.detect_frames(video_frames,
                                             read_from_stub=False,  # Thay đổi thành False
                                             stub_path="tracker_stubs/ball_detections.pkl"
                                             )
```

---

## 🔍 GIẢI THÍCH TỪNG COMPONENT

### 1. **PlayerTracker** - Phát hiện người chơi
```python
# Sử dụng YOLOv8x để phát hiện người
player_tracker = PlayerTracker(model_path='yolov8x')

# Quy trình:
# 1. Phát hiện tất cả người trong frame
# 2. Tracking ID cho mỗi người
# 3. Chọn 2 người gần sân tennis nhất
```

### 2. **BallTracker** - Phát hiện bóng tennis
```python
# Sử dụng fine-tuned YOLOv5
ball_tracker = BallTracker(model_path='models/yolo5_last.pt')

# Quy trình:
# 1. Phát hiện bóng tennis trong mỗi frame
# 2. Interpolate vị trí bóng bị mất
# 3. Phát hiện thời điểm đánh bóng
```

### 3. **CourtLineDetector** - Phát hiện sân tennis
```python
# Sử dụng ResNet50
court_line_detector = CourtLineDetector(court_model_path)

# Quy trình:
# 1. Phát hiện 14 keypoints trên sân tennis
# 2. Tạo hệ tọa độ mini court
# 3. Chuyển đổi pixel sang mét thật
```

### 4. **Luồng xử lý chính:**
```
Video Input → Đọc frames → AI Detection → Tính toán metrics → Vẽ kết quả → Video Output
```

---

## ⚡ TỐI ƯU HIỆU SUẤT

### 1. **Giảm tải models:**
```python
# Thay YOLOv8x bằng YOLOv8s (nhẹ hơn)
player_tracker = PlayerTracker(model_path='yolov8s')  # Thay vì 'yolov8x'
```

### 2. **Sử dụng GPU nếu có:**
```python
# Thêm vào court_line_detector.py
import torch
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
self.model = self.model.to(device)

# Trong predict method:
image_tensor = image_tensor.to(device)
```

### 3. **Xử lý video theo batch:**
```python
# Thay vì đọc toàn bộ video, xử lý từng đoạn
def process_video_batch(video_path, batch_size=100):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    
    while True:
        frames = []
        for i in range(batch_size):
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
        
        if not frames:
            break
            
        # Xử lý batch frames
        process_batch(frames)
        frame_count += len(frames)
```

### 4. **Tối ưu memory:**
```python
# Xóa frames cũ khi không cần
import gc
del video_frames
gc.collect()
```

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "No such file or directory: 'models/yolo5_last.pt'"
**Nguyên nhân**: Chưa tải models
**Giải pháp**:
```bash
cd models/
gdown 1UZwiG1jkWgce9lNhxJ2L0NVjX1vGM05U -O yolo5_last.pt
gdown 1QrTOF1ToQ4plsSZbkBs3zOLkVt3MBlta -O keypoints_model.pth
```

### Lỗi 2: "CUDA out of memory"
**Nguyên nhân**: GPU không đủ memory
**Giải pháp**:
```python
# Sử dụng CPU thay vì GPU
import torch
torch.cuda.empty_cache()  # Xóa cache GPU
# Hoặc force sử dụng CPU trong code
```

### Lỗi 3: "Video file not found"
**Nguyên nhân**: Không có video input
**Giải pháp**:
```bash
# Đặt video tennis vào thư mục input_videos/
# Tên file phải là: input_video.mp4
```

### Lỗi 4: "ImportError: No module named 'ultralytics'"
**Nguyên nhân**: Chưa cài đặt dependencies
**Giải pháp**:
```bash
pip install ultralytics
pip install torch torchvision
pip install opencv-python
```

### Lỗi 5: Máy nóng, chạy chậm
**Nguyên nhân**: Models quá nặng
**Giải pháp**:
```python
# Sử dụng stub data thay vì chạy models
read_from_stub=True

# Hoặc giảm kích thước video
# Resize video xuống 720p hoặc 480p
```

---

## 📈 MỞ RỘNG PROJECT

### 1. **Thêm metrics mới:**
```python
# Trong main.py, thêm tính toán mới
def calculate_new_metric(player_positions, ball_positions):
    # Tính toán metric mới
    return metric_value
```

### 2. **Thêm visualization:**
```python
# Vẽ thêm biểu đồ
import matplotlib.pyplot as plt
plt.plot(speeds)
plt.savefig('speed_chart.png')
```

### 3. **Lưu kết quả vào database:**
```python
import sqlite3
# Lưu thống kê vào database
conn = sqlite3.connect('tennis_stats.db')
# Insert data...
```

### 4. **Tạo web interface:**
```python
# Sử dụng Flask hoặc Streamlit
import streamlit as st
st.title("Tennis Analysis Dashboard")
```

---

## 📚 TÀI LIỆU THAM KHẢO

### 1. **YOLO Documentation:**
- [Ultralytics YOLO](https://docs.ultralytics.com/)
- [YOLOv8 GitHub](https://github.com/ultralytics/ultralytics)

### 2. **OpenCV Documentation:**
- [OpenCV Python Tutorials](https://opencv-python-tutroals.readthedocs.io/)

### 3. **PyTorch Documentation:**
- [PyTorch Tutorials](https://pytorch.org/tutorials/)

### 4. **Computer Vision Concepts:**
- Object Detection
- Keypoint Detection
- Video Processing
- Coordinate Transformation

---

## 🎯 CHECKLIST HOÀN THÀNH

- [ ] Cài đặt Python 3.8+
- [ ] Tạo virtual environment
- [ ] Cài đặt dependencies
- [ ] Tải models (yolo5_last.pt, keypoints_model.pth)
- [ ] Chuẩn bị video input
- [ ] Chạy project với stub data
- [ ] Kiểm tra video output
- [ ] Hiểu cấu trúc code
- [ ] Tối ưu hiệu suất
- [ ] Xử lý lỗi nếu có

---

## 💡 LỜI KHUYÊN CHO NGƯỜI MỚI

### 1. **Bắt đầu từ đơn giản:**
- Chạy project với stub data trước
- Hiểu từng component một cách riêng lẻ
- Đừng cố gắng hiểu tất cả cùng lúc

### 2. **Debug từng bước:**
```python
# Thêm print statements để debug
print(f"Processing frame {i}")
print(f"Player detections: {len(player_detections)}")
```

### 3. **Sử dụng Jupyter Notebook:**
```bash
# Tạo notebook để test từng phần
jupyter notebook
# Tạo file: test_components.ipynb
```

### 4. **Backup và version control:**
```bash
# Sử dụng Git
git init
git add .
git commit -m "Initial commit"
```

### 5. **Đọc documentation:**
- Luôn đọc documentation của các thư viện
- Tìm hiểu parameters và options
- Thử nghiệm với các settings khác nhau

---

## 🆘 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra lại các bước cài đặt
2. Đọc phần "Xử lý lỗi thường gặp"
3. Tìm kiếm trên Google với error message
4. Tham khảo documentation của các thư viện
5. Hỏi trên các forum như Stack Overflow

**Chúc bạn thành công với project Tennis Analysis! 🎾**

---

*Tài liệu này được tạo để hướng dẫn chi tiết cho người mới bắt đầu. Nếu có thắc mắc, hãy tham khảo các phần liên quan hoặc tìm kiếm thêm thông tin.*
