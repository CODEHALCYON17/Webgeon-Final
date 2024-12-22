const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;
const ___dirname = path.resolve();


const USERS_FILE = path.join(__dirname, "users.json");
const ATTENDANCE_FILE = path.join(__dirname, "attendance.json");

app.use(cors({
    origin:process.env.clientUrl
}))
app.use(express.json());

const readJSONFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

//to check whether the user is authorized to access the contents
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    req.user = user;
    next();
  });
};

//to register the user
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const users = readJSONFile(USERS_FILE);

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const isAdmin = username === "admin";
  users.push({ username, password: hashedPassword, isAdmin });
  writeJSONFile(USERS_FILE, users);

  res.status(201).json({ message: "User registered successfully" });
});

//for login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const users = readJSONFile(USERS_FILE);

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username: user.username, isAdmin: user.isAdmin },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res
    .status(200)
    .json({ username: user.username, isAdmin: user.isAdmin, token });
});

//to get attendence of all registered user for admin
app.get("/attendance/all", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  const attendance = readJSONFile(ATTENDANCE_FILE);
  res.status(200).json(attendance);
});

//to modify the attendence 
app.post("/attendance", authenticateToken, (req, res) => {
  const { date, status } = req.body;

  if (!date || !status) {
    return res.status(400).json({ message: "Date and status are required" });
  }

  const attendance = readJSONFile(ATTENDANCE_FILE);
  attendance.push({ username: req.user.username, date, status });
  writeJSONFile(ATTENDANCE_FILE, attendance);

  res.status(201).json({ message: "Attendance recorded successfully" });
});

//to get the attendence of the logged in user
app.get("/attendance", authenticateToken, (req, res) => {
  try {
    const attendance = readJSONFile(ATTENDANCE_FILE);
    const userAttendance = attendance.filter(
      (record) => record.username === req.user.username
    );
    res.status(200).json(userAttendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
});

//to get attendence of specific user by providing username as param
app.get("/attendance/:id", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }

  const username = req.params.id;

  try {
    const attendance = readJSONFile(ATTENDANCE_FILE);
    const userAttendance = attendance.filter(
      (record) => record.username === username
    );

    if (userAttendance.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for this user" });
    }

    res.status(200).json(userAttendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records" });
  }
});

app.use(express.static(path.join(___dirname, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(___dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
