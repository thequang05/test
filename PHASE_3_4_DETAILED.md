# 🎾 HƯỚNG DẪN PHASE 3-4 TỪNG BƯỚC (ĐIỀN HÀM THEO TEMPLATE)

Tài liệu này liệt kê chi tiết các hàm cần viết, tham số vào/ra, tác dụng cho từng file trong Phase 3-4. Bạn chỉ cần tạo hàm đúng chữ ký và điền phần thân theo TODO.

---

## 📋 Mục lục
- [Phase 3: Court Detection & Mini-court](#phase-3-court-detection--mini-court)
  - court_line_detector/court_line_detector.py
  - mini_court/mini_court.py
- [Phase 4: Tracking, Metrics & Visualization](#phase-4-tracking-metrics--visualization)
  - trackers/player_tracker.py (bổ sung phương thức)
  - trackers/ball_tracker.py (bổ sung phương thức)
  - utils/player_stats_drawer_utils.py (vẽ overlay)
- [Outline các Phase tiếp theo](#outline-các-phase-tiếp-theo)

---

## Phase 3: Court Detection & Mini-court

### File: `court_line_detector/court_line_detector.py`
```python
# GIỮ NGUYÊN APIs GỐC
class CourtLineDetector:
    def __init__(self, model_path):
        """
        - Mục đích: Load ResNet50 keypoints và transform.
        - Params: model_path (str)
        """

    def predict(self, image):
        """
        - Mục đích: Trả về mảng 28 giá trị [x1,y1,...,x14,y14] theo pixel.
        - Params: image (np.ndarray)
        - Returns: np.ndarray shape (28,)
        """

    def draw_keypoints(self, image, keypoints):
        """
        - Mục đích: Vẽ keypoints + index lên ảnh.
        - Returns: image đã vẽ
        """

    def draw_keypoints_on_video(self, video_frames, keypoints):
        """
        - Mục đích: Vẽ keypoints lên toàn bộ frames.
        - Returns: list frames đã vẽ
        """

# Cải tiến (tuỳ chọn, KHÔNG THAY APIs gốc): preprocess(frame) -> tensor
```

### File: `mini_court/mini_court.py`
```python
# GIỮ NGUYÊN APIs GỐC
class MiniCourt:
    def __init__(self, frame):
        """Khởi tạo vị trí/khung mini-court và thông số vẽ."""

    def convert_meters_to_pixels(self, meters):
        """Đổi mét → pixel theo chiều ngang sân mini-court."""

    def set_court_drawing_key_points(self):
        """Tính 14 điểm vẽ sân trên khung mini-court."""

    def set_court_lines(self):
        """Định nghĩa các đoạn thẳng (line) cần vẽ trên sân."""

    def set_mini_court_position(self):
        """Tính toạ độ khung mini-court trong panel nền."""

    def set_canvas_background_box_position(self, frame):
        """Tính toạ độ hộp nền mờ ở góc khung hình."""

    def draw_court(self, frame):
        """Vẽ keypoints + lines + net lên frame."""

    def draw_background_rectangle(self, frame):
        """Vẽ panel nền mờ (alpha) để hiển thị mini-court."""

    def draw_mini_court(self, frames):
        """Vẽ mini-court lên toàn bộ frames (trả về list frames)."""

    def get_start_point_of_mini_court(self):
        """Trả về (x,y) góc bắt đầu mini-court."""

    def get_width_of_mini_court(self):
        """Trả về chiều rộng mini-court (pixel)."""

    def get_court_drawing_keypoints(self):
        """Trả về danh sách 28 giá trị (14 điểm) đang dùng để vẽ."""

    def get_mini_court_coordinates(self, object_position, closest_key_point, closest_key_point_index, player_height_in_pixels, player_height_in_meters):
        """Đổi vị trí pixel → toạ độ mini-court theo keypoint gần nhất + scale chiều cao."""

    def convert_bounding_boxes_to_mini_court_coordinates(self, player_boxes, ball_boxes, original_court_key_points):
        """Đổi bboxes người/bóng sang toạ độ mini-court theo từng frame."""

    def draw_points_on_mini_court(self, frames, postions, color=(0,255,0)):
        """Vẽ các điểm (players/ball) lên mini-court theo từng frame."""

# Cải tiến (tuỳ chọn): có thể bổ sung pixel_to_meters(...), nhưng KHÔNG thay thế API gốc
```

---

## Phase 4: Tracking, Metrics & Visualization

### File: `trackers/player_tracker.py` (bổ sung/hoàn thiện)
```python
class PlayerTracker:
    def calculate_player_speed(self, player_detections: list, fps: int = 24) -> dict:
        """
        - Mục đích: Tính tốc độ mỗi người chơi cho từng frame (km/h).
        - Params:
            player_detections: list theo frame → dict {player_id: bbox[x1,y1,x2,y2]}
            fps: frames per second
        - Returns: dict {frame_idx: {player_id: speed_kmh}}
        """

    def draw_bboxes(self, video_frames: list, player_detections: list) -> list:
        """
        - Mục đích: Vẽ bbox và ID lên từng frame.
        - Returns: list frames đã vẽ
        """
```

### File: `trackers/ball_tracker.py` (bổ sung/hoàn thiện)
```python
class BallTracker:
    def interpolate_ball_positions(self, ball_positions: list) -> list:
        """
        - Mục đích: Điền vị trí bóng bị mất bằng interpolation + bfill.
        - Params:
            ball_positions: list theo frame → None hoặc dict {1: bbox}
        - Returns: list cùng độ dài, đã điền vị trí hợp lý
        """

    def get_ball_shot_frames(self, ball_positions: list) -> list[int]:
        """
        - Mục đích: Phát hiện frame index xảy ra cú đánh (đổi hướng rõ rệt).
        - Returns: list frame_idx
        """

    def calculate_ball_speed(self, ball_positions: list, ball_shot_frames: list[int], fps: int = 24) -> list[float]:
        """
        - Mục đích: Tính tốc độ bóng (km/h) giữa các khoảng shot.
        - Returns: list tốc độ theo từng khoảng
        """

    def draw_bboxes(self, video_frames: list, ball_detections: list) -> list:
        """
        - Mục đích: Vẽ bbox bóng (màu khác người chơi) lên từng frame.
        - Returns: list frames đã vẽ
        """
```

### File: `utils/player_stats_drawer_utils.py` (Visualization)
```python
def draw_player_stats(output_video_frames: list, player_stats_df) -> list:
    """
    - Mục đích: Vẽ bảng thống kê theo từng frame.
    - Yêu cầu cột trong player_stats_df:
      'player_1_last_shot_speed', 'player_2_last_shot_speed',
      'player_1_last_player_speed', 'player_2_last_player_speed',
      'player_1_average_shot_speed', 'player_2_average_shot_speed',
      'player_1_average_player_speed', 'player_2_average_player_speed'
    - Returns: list frames đã vẽ
    """
```

---

## Outline các Phase tiếp theo

### Phase 5: Visualization nâng cao
- Vẽ trajectory bóng mượt (smoothing, outlier removal)
- Hiển thị vùng va chạm ước lượng, heatmap di chuyển của người chơi
- Popup highlight khi có cú đánh nhanh > threshold

### Phase 6: Optimization & Robustness
- Batch processing video dài, tối ưu memory
- Cấu hình model nhẹ hơn (YOLOv8s) / half precision
- Cache kết quả theo đoạn (chunk) và resume

### Phase 7: Export & Reporting
- Xuất CSV thống kê (shots, speeds theo thời gian)
- Biểu đồ tốc độ, quãng đường di chuyển
- Tạo report PDF tự động (matplotlib + reportlab)

---

## Gợi ý luồng tích hợp trong `main.py`
1) Đọc video → frames
2) Court keypoints frame đầu → `CourtLineDetector.predict_keypoints`
3) Khởi tạo `MiniCourt`
4) Detections người & bóng (stub hoặc model thật)
5) Chọn/lọc 2 người chơi chính → `PlayerTracker.choose_and_filter_players`
6) Interpolate bóng → `BallTracker.interpolate_ball_positions`
7) Phát hiện shot frames → `BallTracker.get_ball_shot_frames`
8) Tính tốc độ bóng/người → `calculate_ball_speed`, `calculate_player_speed`
9) Pixel → mét → vẽ mini-court + overlay
10) Lưu video output

> Thực hiện theo đúng chữ ký hàm ở trên sẽ giúp bạn chỉ cần “điền phần thân” mà không phải nghĩ về giao diện hàm.


