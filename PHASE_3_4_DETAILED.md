# 🎾 HƯỚNG DẪN CHI TIẾT PHASE 3 & 4 - TENNIS ANALYSIS

---

## 🧭 MỤC TIÊU

- Phase 3: Phát hiện sân tennis (14 keypoints), tạo hệ trục mini-court, ánh xạ pixel → mét
- Phase 4: Tính toán thống kê (tốc độ bóng/người, số cú đánh), vẽ overlay và xuất video hoàn chỉnh

---

## 📋 PHASE 3: COURT DETECTION & MINI COURT

### 1) File: `court_line_detector/court_line_detector.py`
```python
import torch
import cv2
import numpy as np

class CourtLineDetector:
    def __init__(self, model_path: str):
        """
        Khởi tạo ResNet50/Keypoint model để dự đoán 14 keypoints sân tennis

        Args:
            model_path (str): Đường dẫn model keypoints (e.g. models/keypoints_model.pth)
        """
        # TODO: Implement
        # 1. Load model, set eval mode
        # 2. Tạo device (cuda/cpu) và đẩy model lên device
        pass

    def preprocess(self, frame):
        """Tiền xử lý frame (resize/normalize) → tensor cho model."""
        # TODO: Implement
        pass

    def predict_keypoints(self, frame):
        """
        Dự đoán 14 keypoints trên 1 frame

        Returns:
            list[tuple]: [(x1,y1), ..., (x14,y14)] theo thứ tự cố định
        """
        # TODO: Implement
        # 1. Tiền xử lý → tensor
        # 2. model.forward → keypoints (normalized)
        # 3. Convert về pixel coordinates theo kích thước frame
        pass

    def draw_keypoints(self, frame, keypoints, color=(0,255,255)):
        """Vẽ keypoints lên frame để debug/quan sát."""
        # TODO: Implement
        pass
```

### 2) File: `mini_court/mini_court.py`
```python
import numpy as np
import cv2
from typing import List, Tuple

class MiniCourt:
    def __init__(self, court_keypoints: List[Tuple[int,int]], frame_shape):
        """
        Khởi tạo hệ tọa độ mini-court dựa trên 14 keypoints và kích thước frame đầu tiên
        - Tính homography hoặc projective transform từ sân thật → ảnh
        - Lưu các ma trận biến đổi để dùng sau
        """
        # TODO: Implement
        # 1. Định nghĩa các điểm chuẩn (thế giới thực, mét) cho 14 keypoints
        # 2. Tính H (homography) giữa court_real ↔ court_pixel
        pass

    def pixel_to_meters(self, pixel_point: Tuple[float,float]) -> Tuple[float,float]:
        """Chuyển 1 điểm pixel trên ảnh sang tọa độ mét trên sân."""
        # TODO: Implement (dựa trên homography + tỷ lệ kích thước sân)
        pass

    def pixels_to_meters_batch(self, points: List[Tuple[float,float]]):
        # TODO: Vectorize chuyển đổi hàng loạt điểm
        pass

    def draw_mini_court(self, canvas_size=(400, 200)):
        """Vẽ mini-court chuẩn (2D top-down) để overlay vào video."""
        # TODO: Implement
        pass

    def draw_positions(self, mini_court_img, player_positions_m, ball_positions_m):
        """Vẽ vị trí người chơi và bóng (đơn vị mét, chiếu lên mini-court)."""
        # TODO: Implement
        pass
```

### 3) Dữ liệu hình học sân (gợi ý)
- Sử dụng các hằng số trong `constants/__init__.py` (SINGLE_LINE_WIDTH, DOUBLE_LINE_WIDTH, HALF_COURT_LINE_HEIGHT, ...)
- Xác định hệ trục: gốc tại tâm sân, trục X theo bề ngang, trục Y theo dọc sân
- Map 14 keypoints thực → thứ tự model trả về để tính homography ổn định

### 4) Test nhanh Phase 3
```python
# Trong 1 script tạm thời (ví dụ: test_phase_3.py)
from court_line_detector.court_line_detector import CourtLineDetector
from mini_court.mini_court import MiniCourt
from utils.video_utils import read_video

frames = read_video('input_videos/input_video.mp4')
clf = CourtLineDetector('models/keypoints_model.pth')
kp = clf.predict_keypoints(frames[0])
mini = MiniCourt(kp, frame_shape=frames[0].shape)
mini_img = mini.draw_mini_court()
# Lưu/xem mini_img để xác nhận
```

---

## 📊 PHASE 4: TRACKING, METRICS & VISUALIZATION

### 1) Tính toán positions và tốc độ người chơi
```python
# Gợi ý trong trackers/player_tracker.py
from utils.bbox_utils import get_center_of_bbox
from utils.conversions import measure_distance, calculate_speed_mps, convert_mps_to_kmh

def calculate_player_speed(self, player_detections, fps=24):
    """
    Input: list theo frame, mỗi frame là dict {player_id: bbox}
    Output: dict {frame_index: {player_id: speed_kmh}}
    """
    # TODO: Implement
    # 1. Lấy tâm bbox qua các frame → quãng đường pixel
    # 2. Δt = 1/fps → m/s → km/h
    pass
```

### 2) Interpolate bóng, phát hiện ball hits, tính tốc độ bóng
```python
# Gợi ý trong trackers/ball_tracker.py
def interpolate_ball_positions(self, ball_positions):
    # TODO: pandas.DataFrame.interpolate + bfill
    pass

def get_ball_shot_frames(self, ball_positions):
    # TODO: phát hiện khi hướng chuyển động theo trục dọc đổi dấu rõ rệt
    pass

def calculate_ball_speed(self, ball_positions, ball_shot_frames, fps=24):
    # TODO: tốc độ giữa các khoảng shot, đổi ra km/h
    pass
```

### 3) Visualization (Player Stats Drawer)
```python
# File: utils/player_stats_drawer_utils.py (gợi ý template)
import cv2
import numpy as np

def draw_player_stats(output_video_frames, player_stats_df,
                      panel_width=350, panel_height=230,
                      margin_right=400, margin_bottom=500):
    """
    Vẽ bảng thống kê lên từng frame dựa vào DataFrame theo frame index.

    Yêu cầu cột:
      - 'player_1_last_shot_speed', 'player_2_last_shot_speed'
      - 'player_1_last_player_speed', 'player_2_last_player_speed'
      - 'player_1_average_shot_speed', 'player_2_average_shot_speed'
      - 'player_1_average_player_speed', 'player_2_average_player_speed'
    """
    for index, row in player_stats_df.iterrows():
        frame = output_video_frames[index]

        start_x = frame.shape[1] - margin_right
        start_y = frame.shape[0] - margin_bottom
        end_x = start_x + panel_width
        end_y = start_y + panel_height

        overlay = frame.copy()
        cv2.rectangle(overlay, (start_x, start_y), (end_x, end_y), (0, 0, 0), -1)
        cv2.addWeighted(overlay, 0.5, frame, 0.5, 0, frame)

        def put(txt, xy, scale=0.5, thick=1):
            cv2.putText(frame, txt, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, (255,255,255), thick)

        put("     Player 1     Player 2", (start_x+80, start_y+30), 0.6, 2)
        put("Shot Speed", (start_x+10, start_y+80), 0.45, 1)
        put(f"{row['player_1_last_shot_speed']:.1f} km/h    {row['player_2_last_shot_speed']:.1f} km/h",
            (start_x+130, start_y+80), 0.5, 2)

        put("Player Speed", (start_x+10, start_y+120), 0.45, 1)
        put(f"{row['player_1_last_player_speed']:.1f} km/h    {row['player_2_last_player_speed']:.1f} km/h",
            (start_x+130, start_y+120), 0.5, 2)

        put("avg. S. Speed", (start_x+10, start_y+160), 0.45, 1)
        put(f"{row['player_1_average_shot_speed']:.1f} km/h    {row['player_2_average_shot_speed']:.1f} km/h",
            (start_x+130, start_y+160), 0.5, 2)

        put("avg. P. Speed", (start_x+10, start_y+200), 0.45, 1)
        put(f"{row['player_1_average_player_speed']:.1f} km/h    {row['player_2_average_player_speed']:.1f} km/h",
            (start_x+130, start_y+200), 0.5, 2)

        output_video_frames[index] = frame

    return output_video_frames
```

### 4) Ánh xạ pixel → mét bằng `MiniCourt`
```python
# Trong main.py
mini_court = MiniCourt(court_keypoints, frame_shape=video_frames[0].shape)

# Vị trí người chơi/ bóng theo pixel → mét
player_positions_m = {}
for frame_idx, det in enumerate(filtered_player_detections):
    player_positions_m[frame_idx] = {}
    for pid, bbox in det.items():
        cx, cy = get_center_of_bbox(bbox)
        player_positions_m[frame_idx][pid] = mini_court.pixel_to_meters((cx, cy))

ball_positions_m = []
for frame_idx, det in enumerate(ball_detections):
    if det:
        (x1,y1,x2,y2) = list(det.values())[0]
        cx, cy = (x1+x2)/2, (y1+y2)/2
        ball_positions_m.append(mini_court.pixel_to_meters((cx, cy)))
    else:
        ball_positions_m.append(None)
```

### 5) Vẽ overlay thống kê và mini-court
```python
# Gợi ý overlay trong utils/player_stats_drawer_utils.py hoặc ngay trong main.py
def draw_overlay(frame, stats_dict):
    # TODO: Vẽ text: tốc độ P1/P2, tốc độ bóng, số cú đánh, v.v.
    pass

# Vẽ mini-court thu nhỏ ở góc video
mini_img = mini_court.draw_mini_court()
mini_img = mini_court.draw_positions(mini_img, player_positions_m.get(i, {}), ball_positions_m[i])
# TODO: paste mini_img lên frame (ROI) bằng OpenCV
```

### 6) Tích hợp toàn bộ trong `main.py`
Luồng khuyến nghị:
1. Đọc video → `video_frames`
2. Phát hiện keypoints sân frame đầu → `court_keypoints`
3. Khởi tạo `MiniCourt`
4. Detect players/ball (stub hoặc model thật)
5. Chọn và lọc 2 người chơi chính → `filtered_player_detections`
6. Interpolate bóng → `ball_positions_interpolated`
7. Tính shot frames + tốc độ bóng → `ball_speeds`
8. Ánh xạ pixel → mét → tạo `player_positions_m`, `ball_positions_m`
9. Vẽ overlay + mini-court theo từng frame
10. Lưu video output

### 7) Test nhanh Phase 4
```python
# Trong 1 script tạm thời (ví dụ: test_phase_4.py)
# Giả sử đã có detections từ stub
from trackers.player_tracker import PlayerTracker
from trackers.ball_tracker import BallTracker

# TODO: Tạo dữ liệu giả hoặc dùng tracker_stubs/*.pkl để test
# - Tính velocity cho người chơi
# - Phát hiện ball hits và tính tốc độ bóng
# - Vẽ overlay demo lên vài frame và kiểm tra trực quan
```

---

## 🧪 TESTING PHASE 3 & 4

### File: `test_phase_3_4.py`
```python
import sys
sys.path.append('.')

def test_court_and_minicourt():
    # TODO: Load 1 frame → predict 14 keypoints → khởi tạo MiniCourt
    # Kiểm tra homography và vẽ mini-court
    pass

def test_metrics_pipeline():
    # TODO: Dùng stubs để tính tốc độ người chơi và bóng → kiểm tra giá trị hợp lý
    pass

if __name__ == "__main__":
    print("Testing Phase 3 & 4...")
    test_court_and_minicourt()
    test_metrics_pipeline()
    print("Phase 3 & 4 testing completed!")
```

---

## ✅ CHECKLIST PHASE 3 & 4

### Phase 3 - Court Detection & Mini-Court
- [ ] Hoàn thiện `CourtLineDetector.predict_keypoints()`
- [ ] Vẽ `draw_keypoints()` để debug
- [ ] Xác định 14 keypoints thực (thứ tự ổn định)
- [ ] Tính homography trong `MiniCourt`
- [ ] Viết `pixel_to_meters()` và batch convert
- [ ] Vẽ `draw_mini_court()` và `draw_positions()`

### Phase 4 - Tracking, Metrics, Visualization
- [ ] Tính tốc độ người chơi (px → m/s → km/h)
- [ ] Interpolate bóng, phát hiện ball hits
- [ ] Tính tốc độ bóng giữa các lần đánh
- [ ] Ánh xạ tất cả positions sang mét
- [ ] Vẽ overlay: tốc độ P1/P2, tốc độ bóng, số cú đánh
- [ ] Vẽ mini-court overlay lên video
- [ ] Lưu video output hoàn chỉnh

### Mục tiêu sau Phase 3 & 4
- ✅ Phát hiện sân và tạo hệ tọa độ chuẩn
- ✅ Chuyển đổi vững vàng giữa pixel ↔ mét
- ✅ Tính các thống kê chính xác và trực quan
- ✅ Video output có overlay đầy đủ, mini-court rõ ràng

---

## 💡 LƯU Ý & MẸO THỰC TẾ

- Ưu tiên dùng stub để phát triển nhanh logic Phase 3-4, sau đó bật models thật
- Đồng bộ thứ tự 14 keypoints giữa model và logic homography để tránh sai lệch
- Lọc outlier trước khi tính tốc độ (median filter hoặc smoothing đơn giản)
- Khóa FPS cố định khi lưu video để phép tính tốc độ ổn định
- Ghi log giá trị tốc độ trung bình/tối đa để sanity-check

---

## 📎 THAM CHIẾU LIÊN QUAN

- `constants/__init__.py`: Kích thước sân thật
- `mini_court/mini_court.py`: Chuyển đổi tọa độ
- `court_line_detector/court_line_detector.py`: Keypoints detection
- `trackers/player_tracker.py`, `trackers/ball_tracker.py`: Detections & metrics
- `utils/video_utils.py`, `utils/bbox_utils.py`, `utils/conversions.py`: Hỗ trợ cơ bản

"""
Bạn có thể viết code theo các template TODO ở trên, tương tự tinh thần của Phase 1 & 2.
Hãy bắt đầu với stub để kiểm thử nhanh, sau đó thay bằng model thật để ra kết quả cuối cùng.
"""


