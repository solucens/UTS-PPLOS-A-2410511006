<?php

class EmployeeController {
    private $model;

    public function __construct($model) {
        $this->model = $model;
    }

    public function index() {
        $page = isset($_GET["page"]) ? (int) $_GET["page"] : 1;
        $perPage = isset($_GET["per_page"]) ? (int) $_GET["per_page"] : 10;
        $division = $_GET["division"] ?? null;

        $data = $this->model->getAll($page, $perPage, $division);

        http_response_code(200);
        echo json_encode([
            "message" => "Data pegawai dari database",
            "page" => $page,
            "per_page" => $perPage,
            "filter" => [
                "division" => $division
            ],
            "data" => $data
        ]);
    }

    public function store() {
        $input = json_decode(file_get_contents("php://input"), true);

        if (
            empty($input["user_id"]) ||
            empty($input["employee_number"]) ||
            empty($input["name"]) ||
            empty($input["email"]) ||
            empty($input["division_id"]) ||
            empty($input["position_id"])
        ) {
            http_response_code(422);
            echo json_encode([
                "message" => "Data pegawai belum lengkap"
            ]);
            return;
        }

        $success = $this->model->create($input);

        if ($success) {
            http_response_code(201);
            echo json_encode([
                "message" => "Pegawai berhasil ditambahkan"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "message" => "Pegawai gagal ditambahkan"
            ]);
        }
    }
}