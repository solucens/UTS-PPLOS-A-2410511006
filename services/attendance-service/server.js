const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3003;

let attendances = [];

app.post("/attendance/clock-in", (req, res) => {
  const userId = req.headers["x-user-id"] || 1;

  const data = {
    id: attendances.length + 1,
    user_id: userId,
    date: new Date().toISOString().slice(0, 10),
    clock_in: new Date().toISOString(),
    clock_out: null
  };

  attendances.push(data);

  res.status(201).json({
    message: "Clock-in berhasil",
    data
  });
});

app.post("/attendance/clock-out", (req, res) => {
  const userId = req.headers["x-user-id"] || 1;

  const data = attendances
    .reverse()
    .find(item => item.user_id == userId && item.clock_out === null);

  if (!data) {
    return res.status(404).json({
      message: "Data clock-in belum ada"
    });
  }

  data.clock_out = new Date().toISOString();

  res.json({
    message: "Clock-out berhasil",
    data
  });
});

let leaves = [];

app.post("/leaves", (req, res) => {
  const userId = req.headers["x-user-id"] || 1;
  const { start_date, end_date, reason } = req.body;

  if (!start_date || !end_date || !reason) {
    return res.status(422).json({
      message: "start_date, end_date, dan reason wajib diisi"
    });
  }

  const data = {
    id: leaves.length + 1,
    user_id: userId,
    start_date,
    end_date,
    reason,
    status: "pending"
  };

  leaves.push(data);

  res.status(201).json({
    message: "Pengajuan cuti berhasil dibuat",
    data
  });
});

app.get("/leaves", (req, res) => {
  res.json({
    message: "Data pengajuan cuti",
    data: leaves
  });
});

app.put("/leaves/:id/approve", (req, res) => {
  const role = req.headers["x-user-role"];

  if (role !== "admin") {
    return res.status(403).json({
      message: "Hanya admin yang dapat menyetujui cuti"
    });
  }

  const leave = leaves.find(item => item.id == req.params.id);

  if (!leave) {
    return res.status(404).json({
      message: "Pengajuan cuti tidak ditemukan"
    });
  }

  leave.status = "approved";

  res.json({
    message: "Cuti berhasil disetujui",
    data: leave
  });
});

app.get("/attendance/my", (req, res) => {
  const userId = req.headers["x-user-id"] || 1;
  const data = attendances.filter(item => item.user_id == userId);

  res.json({
    message: "Riwayat absensi",
    data
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Attendance service jalan" });
});

app.listen(PORT, () => {
  console.log(`Attendance service running on ${PORT}`);
});