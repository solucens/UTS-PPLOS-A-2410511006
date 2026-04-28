<?php

header("Content-Type: application/json");

require_once __DIR__ . "/config/database.php";
require_once __DIR__ . "/models/EmployeeModel.php";
require_once __DIR__ . "/controllers/EmployeeController.php";

$db = Database::connect();
$model = new EmployeeModel($db);
$controller = new EmployeeController($model);

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if ($uri === "/employees" && $method === "GET") {
    $controller->index();
} 
elseif ($uri === "/employees" && $method === "POST") {
    $controller->store();
} 
else {
    http_response_code(404);
    echo json_encode([
        "message" => "Endpoint tidak ditemukan"
    ]);
}