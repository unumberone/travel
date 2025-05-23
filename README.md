Dưới đây là hướng dẫn đơn giản để cài đặt và sử dụng **Ngrok** với cổng 5000.

---

## **Hướng Dẫn Sử Dụng Ngrok**

### **1. Cài Đặt Ngrok**

1. **Tải Ngrok** từ [ngrok.com/download](https://ngrok.com/download).
2. **Giải nén**:

   * **Windows**: Giải nén và đặt tệp `ngrok.exe` vào thư mục dễ truy cập (ví dụ: `C:\ngrok`).
   * **macOS/Linux**: Giải nén và di chuyển tệp `ngrok` vào `/usr/local/bin`.

---

### **2. Thiết Lập Tài Khoản**

1. Đăng ký hoặc đăng nhập tại [ngrok.com](https://ngrok.com).
2. Lấy **Authtoken** từ trang dashboard.
3. Thêm Authtoken vào Ngrok:

   ```bash
   ngrok config add-authtoken <your_authtoken>
   ```

---

### **3. Sử Dụng Ngrok**

1. Chạy ứng dụng cục bộ của bạn trên cổng 5000 (ví dụ: Flask, Node.js).
2. Mở terminal và chạy:

   ```bash
   ngrok http 5000
   ```
3. Ngrok sẽ hiển thị một URL công khai (dạng `https://<subdomain>.ngrok.io`), sử dụng URL này để truy cập ứng dụng của bạn từ bất kỳ đâu.

---

**Vậy là xong!** Ngrok đã sẵn sàng để bạn sử dụng. 😊


4. Thay https://ea44-2001-ee0-7858-24b0-1c63-8a2a-635-85b5.ngrok-free.app trong file travelCLI\backend\middleware\momoPaymentMiddleware.js bằng url của ngrok