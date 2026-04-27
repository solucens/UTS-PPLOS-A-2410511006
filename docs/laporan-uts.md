# LAPORAN UTS
## Sistem Kepegawaian & Absensi Berbasis Service-Oriented

### 1. Latar Belakang
Sistem kepegawaian dan absensi dibutuhkan untuk membantu organisasi dalam mengelola data pegawai, presensi harian, serta pengajuan cuti. Dengan meningkatnya kebutuhan akan sistem yang scalable, maka digunakan pendekatan service-oriented.

### 2. Studi Kasus
Digit terakhir NIM adalah 6, sehingga studi kasus yang digunakan adalah Sistem Kepegawaian & Absensi.

### 3. Arsitektur Sistem
Sistem terdiri dari:
- API Gateway sebagai pintu utama
- Auth Service untuk autentikasi JWT
- Employee Service untuk data pegawai
- Attendance Service untuk absensi dan cuti

Client hanya mengakses API melalui gateway.

### 4. Justifikasi Microservice
Auth Service dipisahkan karena menangani keamanan sistem.  
Employee Service mengelola data pegawai.  
Attendance Service menangani absensi dan cuti.  

Jika menggunakan monolitik, perubahan pada satu fitur dapat memengaruhi sistem lain.

### 5. REST API
Sistem menggunakan metode:
- GET
- POST
- PUT

Dengan response:
- 200 OK
- 201 Created
- 401 Unauthorized
- 404 Not Found

### 6. JWT
Login menghasilkan token yang digunakan untuk mengakses endpoint lain melalui header Authorization.

### 7. API Gateway
Gateway berfungsi sebagai routing dan validasi token sebelum request diteruskan ke service lain.

### 8. Kesimpulan
Sistem berhasil dibangun dengan pendekatan service-oriented dan dapat menjalankan fungsi utama seperti login, absensi, dan pengelolaan data pegawai.