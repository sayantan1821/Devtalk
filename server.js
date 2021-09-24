const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB(); //database connect
app.get("/", (req, res) => res.send("API Running"));

app.use(express.json({ extended: false })); //middleware

app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// To start server command npm run server and check localhost:1821 posrt
//test from code sandbox

//To start server and client both command npm run dev