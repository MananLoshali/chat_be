import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { connectToDB } from "./utils/initDB.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/user.js";
import chatsRoute from "./routes/chat.js";

dotenv.config({ path: ".env.local" });
const app = express();

const PORT = process.env.PORT || 5000;
connectToDB();
const server = createServer(app);
app.use(cors());
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const io = new Server(server, {
  cors: {
    origin: "https://samvadhub.vercel.app/",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join", (userId) => {
    console.log(`User with ID ${userId} joined room ${userId}`);

    socket.join(userId); // User joins their room
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/chats/", chatsRoute);

server.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
