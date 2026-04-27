<?php

header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

$employees = [
    [
        "id" => 1,
        "name" => "Amanda Puspitarina",
        "email" => "amanda@mail.com",
        "position" => "Staff Administrasi",
        "division" => "Human Resource"
    ]
];

if ($uri === "/employees" && $method === "GET") {
    echo json_encode([
        "message" => "Data pegawai berhasil diambil",
        "data" => $employees
    ]);
} elseif ($uri === "/employees" && $method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    echo json_encode([
        "message" => "Pegawai berhasil ditambahkan",
        "data" => $input
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "message" => "Endpoint tidak ditemukan"
    ]);
}