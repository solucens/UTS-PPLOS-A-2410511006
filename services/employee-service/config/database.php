<?php

class Database {
    public static function connect() {
        $conn = new mysqli("localhost", "root", "", "employee_db");

        if ($conn->connect_error) {
            http_response_code(500);
            echo json_encode([
                "message" => "Koneksi database gagal",
                "error" => $conn->connect_error
            ]);
            exit;
        }

        return $conn;
    }
}