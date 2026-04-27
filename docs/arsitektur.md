# Diagram Arsitektur Sistem

Client/Postman
↓
API Gateway :8000
↓
├── Auth Service :3001
│   └── Login, Refresh Token, Logout, JWT
│
├── Employee Service :8080
│   └── Data Pegawai + MySQL employee_db
│
└── Attendance Service :3003
    └── Clock-in, Clock-out, Cuti, Approval