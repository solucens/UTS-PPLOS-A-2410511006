# UTS PPLOS A - Sistem Kepegawaian & Absensi

Nama: Amanda Puspitarina  
NIM: 2410511006  
Kelas: A Informatika  

## Studi Kasus
Digit terakhir NIM adalah 6, sehingga studi kasus yang dikerjakan adalah Sistem Kepegawaian & Absensi.

## Arsitektur Sistem
Sistem menggunakan konsep service-oriented dengan 3 microservice dan 1 API Gateway.

## Daftar Service
1. API Gateway - Port 8000
2. Auth Service - Port 3001
3. Employee Service - Port 8080
4. Attendance Service - Port 3003

## Endpoint

### Auth
POST /api/auth/login

### Employee
GET /api/employees  
POST /api/employees

### Attendance
POST /api/attendance/clock-in  
POST /api/attendance/clock-out  
GET /api/attendance/my

### Leave
POST /api/leaves  
GET /api/leaves  
PUT /api/leaves/1/approve

## Cara Menjalankan

### Gateway
cd gateway  
node server.js

### Auth Service
cd services/auth-service  
node server.js

### Employee Service
cd services/employee-service  
php -S localhost:8080

### Attendance Service
cd services/attendance-service  
node server.js

## Akun Login
email: admin@mail.com  
password: 123

## Catatan
Semua request client dilakukan melalui API Gateway di port 8000.