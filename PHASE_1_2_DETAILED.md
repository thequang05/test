# 🎾 HƯỚNG DẪN CHI TIẾT PHASE 1 & 2 - VIẾT PROJECT TENNIS ANALYSIS

## 📋 PHASE 1: SETUP CƠ BẢN

### Bước 1: Tạo cấu trúc thư mục
```bash
mkdir tennis_analysis_project
cd tennis_analysis_project

mkdir utils
mkdir trackers
mkdir court_line_detector
mkdir mini_court
mkdir constants
mkdir input_videos
mkdir output_videos
mkdir models
```

### Bước 2: Tạo file requirements.txt
```txt
ultralytics>=8.0.0
torch>=1.9.0
torchvision>=0.10.0
opencv-python>=4.5.0
pandas>=1.3.0
numpy>=1.21.0
gdown>=4.0.0
matplotlib>=3.5.0
```

---

## 📁 PHASE 1: VIẾT VIDEO UTILS

### File: `utils/__init__.py`
```python
# File rỗng để tạo package
```

### File: `utils/video_utils.py`
```python
import cv2
import os

def read_video(video_path):
    """
    Đọc video và trả về danh sách các frame
    
    Args:
        video_path (str): Đường dẫn đến file video
        
    Returns:
        list: Danh sách các frame (numpy arrays)
    """
    # TODO: Implement function này
    # 1. Mở video với cv2.VideoCapture()
    # 2. Đọc từng frame với cap.read()
    # 3. Thêm frame vào list frames
    # 4. Đóng video capture
    # 5. Trả về list frames
    pass

def save_video(frames, output_path, fps=24):
    """
    Lưu danh sách frames thành video
    
    Args:
        frames (list): Danh sách các frame
        output_path (str): Đường dẫn file output
        fps (int): Frames per second
    """
    # TODO: Implement function này
    # 1. Lấy kích thước frame từ frame đầu tiên
    # 2. Tạo VideoWriter với codec MJPG
    # 3. Ghi từng frame với out.write()
    # 4. Đóng VideoWriter
    pass

def resize_video(frames, target_width=None, target_height=None):
    """
    Thay đổi kích thước video
    
    Args:
        frames (list): Danh sách các frame
        target_width (int): Chiều rộng mới (None = giữ nguyên tỷ lệ)
        target_height (int): Chiều cao mới (None = giữ nguyên tỷ lệ)
        
    Returns:
        list: Danh sách frames đã resize
    """
    # TODO: Implement function này
    # 1. Lấy kích thước frame gốc
    # 2. Tính kích thước mới (giữ tỷ lệ nếu cần)
    # 3. Resize từng frame với cv2.resize()
    # 4. Trả về list frames mới
    pass

def get_video_info(video_path):
    """
    Lấy thông tin video
    
    Args:
        video_path (str): Đường dẫn video
        
    Returns:
        dict: Thông tin video (fps, frame_count, width, height)
    """
    # TODO: Implement function này
    # 1. Mở video với cv2.VideoCapture()
    # 2. Lấy fps, frame_count, width, height
    # 3. Đóng video capture
    # 4. Trả về dictionary với thông tin
    pass

def extract_frames_at_timestamps(video_path, timestamps):
    """
    Trích xuất frames tại các thời điểm cụ thể
    
    Args:
        video_path (str): Đường dẫn video
        timestamps (list): Danh sách thời điểm (seconds)
        
    Returns:
        list: Danh sách frames tại các thời điểm
    """
    # TODO: Implement function này
    # 1. Mở video
    # 2. Lấy fps
    # 3. Với mỗi timestamp, tính frame number
    # 4. Set frame position với cap.set()
    # 5. Đọc frame
    # 6. Trả về list frames
    pass
```

---

## 📁 PHASE 1: VIẾT BBOX UTILS

### File: `utils/bbox_utils.py`
```python
import numpy as np

def get_center_of_bbox(bbox):
    """
    Lấy tâm của bounding box
    
    Args:
        bbox (list): [x1, y1, x2, y2]
        
    Returns:
        tuple: (center_x, center_y)
    """
    # TODO: Implement function này
    # 1. Tính center_x = (x1 + x2) / 2
    # 2. Tính center_y = (y1 + y2) / 2
    # 3. Trả về (center_x, center_y)
    pass

def get_width_of_bbox(bbox):
    """
    Lấy chiều rộng của bounding box
    
    Args:
        bbox (list): [x1, y1, x2, y2]
        
    Returns:
        float: Chiều rộng
    """
    # TODO: Implement function này
    # Trả về x2 - x1
    pass

def get_height_of_bbox(bbox):
    """
    Lấy chiều cao của bounding box
    
    Args:
        bbox (list): [x1, y1, x2, y2]
        
    Returns:
        float: Chiều cao
    """
    # TODO: Implement function này
    # Trả về y2 - y1
    pass

def get_area_of_bbox(bbox):
    """
    Lấy diện tích của bounding box
    
    Args:
        bbox (list): [x1, y1, x2, y2]
        
    Returns:
        float: Diện tích
    """
    # TODO: Implement function này
    # Trả về width * height
    pass

def calculate_iou(bbox1, bbox2):
    """
    Tính Intersection over Union (IoU) của 2 bounding box
    
    Args:
        bbox1 (list): [x1, y1, x2, y2]
        bbox2 (list): [x1, y1, x2, y2]
        
    Returns:
        float: IoU score (0-1)
    """
    # TODO: Implement function này
    # 1. Tính intersection area
    # 2. Tính union area
    # 3. Trả về intersection / union
    pass

def draw_bbox_on_frame(frame, bbox, color=(0, 255, 0), thickness=2):
    """
    Vẽ bounding box lên frame
    
    Args:
        frame (numpy.ndarray): Frame ảnh
        bbox (list): [x1, y1, x2, y2]
        color (tuple): Màu BGR
        thickness (int): Độ dày đường vẽ
        
    Returns:
        numpy.ndarray: Frame đã vẽ bbox
    """
    # TODO: Implement function này
    # 1. Convert bbox coordinates to int
    # 2. Vẽ rectangle với cv2.rectangle()
    # 3. Trả về frame
    pass
```

---

## 📁 PHASE 1: VIẾT CONVERSION UTILS

### File: `utils/conversions.py`
```python
import math

def measure_distance(point1, point2):
    """
    Tính khoảng cách Euclidean giữa 2 điểm
    
    Args:
        point1 (tuple): (x1, y1)
        point2 (tuple): (x2, y2)
        
    Returns:
        float: Khoảng cách
    """
    # TODO: Implement function này
    # Sử dụng công thức: sqrt((x2-x1)^2 + (y2-y1)^2)
    pass

def convert_pixel_distance_to_meters(pixel_distance, reference_height_in_meters, reference_height_in_pixels):
    """
    Chuyển đổi khoảng cách pixel sang mét
    
    Args:
        pixel_distance (float): Khoảng cách pixel
        reference_height_in_meters (float): Chiều cao tham chiếu (mét)
        reference_height_in_pixels (float): Chiều cao tham chiếu (pixel)
        
    Returns:
        float: Khoảng cách mét
    """
    # TODO: Implement function này
    # Công thức: (pixel_distance * reference_height_in_meters) / reference_height_in_pixels
    pass

def convert_meters_to_pixel_distance(meters, reference_height_in_meters, reference_height_in_pixels):
    """
    Chuyển đổi khoảng cách mét sang pixel
    
    Args:
        meters (float): Khoảng cách mét
        reference_height_in_meters (float): Chiều cao tham chiếu (mét)
        reference_height_in_pixels (float): Chiều cao tham chiếu (pixel)
        
    Returns:
        float: Khoảng cách pixel
    """
    # TODO: Implement function này
    # Công thức ngược lại
    pass

def calculate_speed_mps(distance_meters, time_seconds):
    """
    Tính tốc độ m/s
    
    Args:
        distance_meters (float): Khoảng cách (mét)
        time_seconds (float): Thời gian (giây)
        
    Returns:
        float: Tốc độ (m/s)
    """
    # TODO: Implement function này
    # Trả về distance_meters / time_seconds
    pass

def convert_mps_to_kmh(speed_mps):
    """
    Chuyển đổi m/s sang km/h
    
    Args:
        speed_mps (float): Tốc độ (m/s)
        
    Returns:
        float: Tốc độ (km/h)
    """
    # TODO: Implement function này
    # Công thức: speed_mps * 3.6
    pass

def calculate_angle_between_points(point1, point2):
    """
    Tính góc giữa 2 điểm (đơn vị độ)
    
    Args:
        point1 (tuple): (x1, y1)
        point2 (tuple): (x2, y2)
        
    Returns:
        float: Góc (độ)
    """
    # TODO: Implement function này
    # Sử dụng math.atan2() và chuyển sang độ
    pass
```

---

## 📁 PHASE 1: VIẾT CONSTANTS

### File: `constants/__init__.py`
```python
# Kích thước sân tennis thật (mét)
SINGLE_LINE_WIDTH = 8.23
DOUBLE_LINE_WIDTH = 10.97
HALF_COURT_LINE_HEIGHT = 11.88
SERVICE_LINE_WIDTH = 6.4
DOUBLE_ALLY_DIFFERENCE = 1.37
NO_MANS_LAND_HEIGHT = 5.48

# Chiều cao trung bình người chơi (mét)
PLAYER_1_HEIGHT_METERS = 1.88
PLAYER_2_HEIGHT_METERS = 1.91

# Video settings
DEFAULT_FPS = 24
DEFAULT_VIDEO_CODEC = 'MJPG'

# Detection settings
DEFAULT_CONFIDENCE_THRESHOLD = 0.5
DEFAULT_IOU_THRESHOLD = 0.45

# Ball detection settings
BALL_HIT_DETECTION_THRESHOLD = 25  # frames
MIN_BALL_SPEED_THRESHOLD = 50  # km/h
```

---

## 📁 PHASE 2: VIẾT PLAYER TRACKER

### File: `trackers/__init__.py`
```python
# File rỗng để tạo package
```

### File: `trackers/player_tracker.py`
```python
from ultralytics import YOLO
import cv2
import pickle
import sys
sys.path.append('../')
from utils.bbox_utils import get_center_of_bbox, draw_bbox_on_frame
from utils.conversions import measure_distance

class PlayerTracker:
    def __init__(self, model_path):
        """
        Khởi tạo PlayerTracker
        
        Args:
            model_path (str): Đường dẫn đến YOLO model
        """
        # TODO: Implement function này
        # 1. Load YOLO model với ultralytics
        # 2. Set model parameters (confidence, iou)
        pass

    def detect_frame(self, frame):
        """
        Phát hiện người trong 1 frame
        
        Args:
            frame (numpy.ndarray): Frame ảnh
            
        Returns:
            dict: {track_id: [x1, y1, x2, y2]}
        """
        # TODO: Implement function này
        # 1. Chạy YOLO detection với model.track()
        # 2. Lọc chỉ lấy class "person"
        # 3. Trích xuất track_id và bbox
        # 4. Trả về dictionary {track_id: bbox}
        pass

    def detect_frames(self, frames, read_from_stub=False, stub_path=None):
        """
        Phát hiện người trong nhiều frames
        
        Args:
            frames (list): Danh sách frames
            read_from_stub (bool): Có đọc từ file stub không
            stub_path (str): Đường dẫn file stub
            
        Returns:
            list: Danh sách detection results
        """
        # TODO: Implement function này
        # 1. Nếu read_from_stub=True, load từ pickle file
        # 2. Nếu không, chạy detect_frame() cho từng frame
        # 3. Lưu kết quả vào stub file nếu cần
        # 4. Trả về list detections
        pass

    def choose_players(self, court_keypoints, player_dict):
        """
        Chọn 2 người chơi gần sân tennis nhất
        
        Args:
            court_keypoints (list): Keypoints của sân tennis
            player_dict (dict): {track_id: bbox}
            
        Returns:
            list: [player_id1, player_id2]
        """
        # TODO: Implement function này
        # 1. Tính khoảng cách từ mỗi player đến sân tennis
        # 2. Sắp xếp theo khoảng cách
        # 3. Chọn 2 player gần nhất
        # 4. Trả về list [player_id1, player_id2]
        pass

    def choose_and_filter_players(self, court_keypoints, player_detections):
        """
        Chọn và lọc người chơi cho toàn bộ video
        
        Args:
            court_keypoints (list): Keypoints của sân tennis
            player_detections (list): Danh sách detection results
            
        Returns:
            list: Filtered player detections
        """
        # TODO: Implement function này
        # 1. Chọn 2 players từ frame đầu tiên
        # 2. Lọc chỉ giữ lại 2 players này trong tất cả frames
        # 3. Trả về filtered detections
        pass

    def draw_bboxes(self, video_frames, player_detections):
        """
        Vẽ bounding boxes lên video
        
        Args:
            video_frames (list): Danh sách frames
            player_detections (list): Danh sách detection results
            
        Returns:
            list: Frames đã vẽ bboxes
        """
        # TODO: Implement function này
        # 1. Với mỗi frame và detection tương ứng
        # 2. Vẽ bbox cho mỗi player
        # 3. Thêm text "Player ID: X"
        # 4. Trả về frames đã vẽ
        pass

    def calculate_player_speed(self, player_detections, fps=24):
        """
        Tính tốc độ di chuyển của người chơi
        
        Args:
            player_detections (list): Danh sách detection results
            fps (int): Frames per second
            
        Returns:
            dict: {frame: {player_id: speed_kmh}}
        """
        # TODO: Implement function này
        # 1. Tính khoảng cách giữa 2 frame liên tiếp
        # 2. Tính thời gian giữa 2 frame (1/fps)
        # 3. Tính tốc độ (distance/time)
        # 4. Chuyển đổi sang km/h
        # 5. Trả về dictionary speeds
        pass
```

---

## 📁 PHASE 2: VIẾT BALL TRACKER

### File: `trackers/ball_tracker.py`
```python
from ultralytics import YOLO
import cv2
import pickle
import pandas as pd
import numpy as np

class BallTracker:
    def __init__(self, model_path):
        """
        Khởi tạo BallTracker
        
        Args:
            model_path (str): Đường dẫn đến fine-tuned YOLO model
        """
        # TODO: Implement function này
        # 1. Load fine-tuned YOLO model
        # 2. Set confidence threshold thấp hơn (0.15)
        pass

    def detect_frame(self, frame):
        """
        Phát hiện bóng tennis trong 1 frame
        
        Args:
            frame (numpy.ndarray): Frame ảnh
            
        Returns:
            dict: {1: [x1, y1, x2, y2]} hoặc {} nếu không phát hiện
        """
        # TODO: Implement function này
        # 1. Chạy YOLO detection với model.predict()
        # 2. Lọc chỉ lấy bóng tennis
        # 3. Trả về {1: bbox} hoặc {} nếu không có
        pass

    def detect_frames(self, frames, read_from_stub=False, stub_path=None):
        """
        Phát hiện bóng tennis trong nhiều frames
        
        Args:
            frames (list): Danh sách frames
            read_from_stub (bool): Có đọc từ file stub không
            stub_path (str): Đường dẫn file stub
            
        Returns:
            list: Danh sách detection results
        """
        # TODO: Implement function này
        # Tương tự PlayerTracker.detect_frames()
        pass

    def interpolate_ball_positions(self, ball_positions):
        """
        Điền vị trí bóng bị mất bằng interpolation
        
        Args:
            ball_positions (list): Danh sách ball detections
            
        Returns:
            list: Ball positions đã interpolate
        """
        # TODO: Implement function này
        # 1. Convert sang pandas DataFrame
        # 2. Sử dụng interpolate() để điền missing values
        # 3. Sử dụng bfill() để điền giá trị cuối
        # 4. Convert lại về format gốc
        pass

    def get_ball_shot_frames(self, ball_positions):
        """
        Phát hiện thời điểm đánh bóng
        
        Args:
            ball_positions (list): Danh sách ball positions
            
        Returns:
            list: Danh sách frame numbers khi đánh bóng
        """
        # TODO: Implement function này
        # 1. Tính rolling mean của y-coordinate
        # 2. Tính delta_y (thay đổi vị trí y)
        # 3. Phát hiện khi delta_y đổi dấu (từ lên xuống hoặc ngược lại)
        # 4. Kiểm tra có đủ frames thay đổi không
        # 5. Trả về list frame numbers
        pass

    def calculate_ball_speed(self, ball_positions, ball_shot_frames, fps=24):
        """
        Tính tốc độ bóng giữa các cú đánh
        
        Args:
            ball_positions (list): Danh sách ball positions
            ball_shot_frames (list): Danh sách frame numbers
            fps (int): Frames per second
            
        Returns:
            list: Danh sách tốc độ bóng (km/h)
        """
        # TODO: Implement function này
        # 1. Với mỗi cặp shot frames liên tiếp
        # 2. Tính khoảng cách pixel giữa 2 vị trí
        # 3. Tính thời gian (frames/fps)
        # 4. Tính tốc độ (distance/time)
        # 5. Chuyển đổi sang km/h
        # 6. Trả về list speeds
        pass

    def draw_bboxes(self, video_frames, ball_detections):
        """
        Vẽ bounding boxes bóng tennis lên video
        
        Args:
            video_frames (list): Danh sách frames
            ball_detections (list): Danh sách detection results
            
        Returns:
            list: Frames đã vẽ bboxes
        """
        # TODO: Implement function này
        # Tương tự PlayerTracker.draw_bboxes() nhưng với màu khác
        pass

    def track_ball_trajectory(self, ball_positions):
        """
        Tracking trajectory của bóng
        
        Args:
            ball_positions (list): Danh sách ball positions
            
        Returns:
            list: Ball trajectory với smoothing
        """
        # TODO: Implement function này
        # 1. Áp dụng Kalman filter hoặc simple smoothing
        # 2. Loại bỏ outliers
        # 3. Trả về smoothed trajectory
        pass
```

---

## 🧪 TESTING PHASE 1 & 2

### File: `test_phase_1_2.py`
```python
import cv2
import sys
sys.path.append('.')
from utils.video_utils import read_video, save_video, get_video_info
from utils.bbox_utils import get_center_of_bbox, draw_bbox_on_frame
from utils.conversions import measure_distance, convert_pixel_distance_to_meters
from trackers.player_tracker import PlayerTracker
from trackers.ball_tracker import BallTracker

def test_video_utils():
    """Test các function trong video_utils"""
    # TODO: Test các functions
    # 1. Đọc video test
    # 2. Lấy thông tin video
    # 3. Resize video
    # 4. Lưu video
    pass

def test_bbox_utils():
    """Test các function trong bbox_utils"""
    # TODO: Test các functions
    # 1. Tạo test bbox
    # 2. Test get_center, get_width, get_height
    # 3. Test calculate_iou
    # 4. Test draw_bbox_on_frame
    pass

def test_conversions():
    """Test các function trong conversions"""
    # TODO: Test các functions
    # 1. Test measure_distance
    # 2. Test convert_pixel_to_meters
    # 3. Test calculate_speed
    # 4. Test convert_mps_to_kmh
    pass

def test_player_tracker():
    """Test PlayerTracker"""
    # TODO: Test PlayerTracker
    # 1. Khởi tạo tracker
    # 2. Load 1 frame test
    # 3. Detect players
    # 4. Test choose_players
    pass

def test_ball_tracker():
    """Test BallTracker"""
    # TODO: Test BallTracker
    # 1. Khởi tạo tracker (cần model)
    # 2. Load 1 frame test
    # 3. Detect ball
    # 4. Test interpolation
    pass

if __name__ == "__main__":
    print("Testing Phase 1 & 2...")
    test_video_utils()
    test_bbox_utils()
    test_conversions()
    # test_player_tracker()  # Cần YOLO model
    # test_ball_tracker()    # Cần fine-tuned model
    print("Phase 1 & 2 testing completed!")
```

---

## 📝 CHECKLIST PHASE 1 & 2

### Phase 1 - Setup cơ bản:
- [ ] Tạo cấu trúc thư mục
- [ ] Viết `utils/video_utils.py` với 5 functions
- [ ] Viết `utils/bbox_utils.py` với 6 functions
- [ ] Viết `utils/conversions.py` với 6 functions
- [ ] Viết `constants/__init__.py`
- [ ] Test tất cả functions

### Phase 2 - Object Detection:
- [ ] Viết `trackers/player_tracker.py` với 7 methods
- [ ] Viết `trackers/ball_tracker.py` với 8 methods
- [ ] Test PlayerTracker (cần YOLO model)
- [ ] Test BallTracker (cần fine-tuned model)
- [ ] Tạo file test_phase_1_2.py

### Mục tiêu sau Phase 1 & 2:
- ✅ Có thể đọc/ghi video
- ✅ Có thể xử lý bounding box
- ✅ Có thể chuyển đổi đơn vị
- ✅ Có thể phát hiện người chơi
- ✅ Có thể phát hiện bóng tennis
- ✅ Sẵn sàng cho Phase 3 (Court Detection)

**Bây giờ bạn có thể bắt đầu viết code theo các template trên! 🚀**
