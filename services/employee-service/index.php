<?php

header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "employee_db");

if ($conn->connect_error) {
    die(json_encode(["message" => "Koneksi gagal"]));
}

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($uri === "/employees" && $method === "GET") {

    $result = $conn->query("
        SELECT e.id, e.name, e.email, d.name AS division, p.name AS position
        FROM employees e
        JOIN divisions d ON e.division_id = d.id
        JOIN positions p ON e.position_id = p.id
    ");

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode([
        "message" => "Data pegawai dari database",
        "data" => $data
    ]);
}
elseif ($uri === "/employees" && $method === "POST") {

    $input = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("
        INSERT INTO employees (user_id, employee_number, name, email, division_id, position_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "isssii",
        $input["user_id"],
        $input["employee_number"],
        $input["name"],
        $input["email"],
        $input["division_id"],
        $input["position_id"]
    );

    $stmt->execute();

    echo json_encode([
        "message" => "Pegawai berhasil ditambahkan"
    ]);
}
else {
    http_response_code(404);
    echo json_encode([
        "message" => "Endpoint tidak ditemukan"
    ]);
}