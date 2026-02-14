const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectdb } = require("./config/dbcon");
const { route } = require("./routes/loginRoutes");
const { setupSocket } = require("./services/socketHandler");

const app = express();
const server = http.createServer(app);

// setup socket.io
setupSocket(server);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(route);

connectdb();

server.listen(3000, () => console.log("Server running on port 3000"));
