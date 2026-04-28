<?php

class EmployeeModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll($page, $perPage, $division = null) {
        $offset = ($page - 1) * $perPage;

        $sql = "
            SELECT e.id, e.name, e.email, e.employee_number,
                   d.name AS division, p.name AS position
            FROM employees e
            JOIN divisions d ON e.division_id = d.id
            JOIN positions p ON e.position_id = p.id
        ";

        if ($division) {
            $sql .= " WHERE d.name LIKE ?";
        }

        $sql .= " LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($sql);

        if ($division) {
            $search = "%$division%";
            $stmt->bind_param("sii", $search, $perPage, $offset);
        } else {
            $stmt->bind_param("ii", $perPage, $offset);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        return $data;
    }

    public function create($input) {
        $stmt = $this->conn->prepare("
            INSERT INTO employees 
            (user_id, employee_number, name, email, division_id, position_id)
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

        return $stmt->execute();
    }
}