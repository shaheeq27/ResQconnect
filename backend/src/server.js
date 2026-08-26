require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const notificationRoutes = require("./routes/notificationRoutes");
const pool = require("./config/database");
const app = express();
const server = http.createServer(app);
const authRoutes = require("./routes/authRoutes");
const helpRequestRoutes = require("./routes/helpRequestRoutes");
const managerRoutes = require("./routes/managerRoutes");
const providerRoutes = require("./routes/providerRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { Server } = require("socket.io");
const { createNotification } = require("./models/notificationModel");
const { createMessage } = require("./models/messageModels");
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error.message);
    next(new Error("Invalid authentication token"));
  }
});
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.id}`);

  console.log(`Socket ID: ${socket.id}`);

  socket.on("join_request", async (requestId) => {
    try {
      const result = await pool.query(
        `
            SELECT
                requester_id,
                assigned_provider_id
            FROM help_requests
            WHERE id = $1
            `,
        [requestId],
      );

      if (result.rows.length === 0) {
        socket.emit("chat_error", {
          message: "Help request not found",
        });

        return;
      }

      const request = result.rows[0];

      const userId = socket.user.id;

      const isRequester = Number(request.requester_id) === Number(userId);

      const isProvider =
        Number(request.assigned_provider_id) === Number(userId);

      if (!isRequester && !isProvider) {
        socket.emit("chat_error", {
          message: "Access denied. You are not part of this help request.",
        });

        return;
      }

      const room = `request_${requestId}`;

      socket.join(room);

      console.log(`User ${userId} joined ${room}`);

      socket.emit("joined_request", {
        requestId,
        message: "Joined chat successfully",
      });
    } catch (error) {
      console.error("Join request error:", error);

      socket.emit("chat_error", {
        message: "Unable to join chat",
      });
    }
  });
  socket.on("send_message", async (data) => {
    try {
      const { requestId, message } = data;
      const senderId = socket.user.id;
      const requestResult = await pool.query(
        `
    SELECT requester_id, assigned_provider_id
    FROM help_requests
    WHERE id = $1
    `,
        [requestId],
      );

      const request = requestResult.rows[0];

      let receiverId;

      if (Number(request.requester_id) === Number(senderId)) {
        receiverId = request.assigned_provider_id;
      } else {
        receiverId = request.requester_id;
      }

      if (receiverId) {
        await createNotification(
          receiverId,
          requestId,
          "new_message",
          "New Chat Message",
          "You have received a new message.",
        );
      }
      if (!message || !message.trim()) {
        socket.emit("chat_error", {
          message: "Message cannot be empty",
        });

        return;
      }

      const room = `request_${requestId}`;

      const savedMessage = await createMessage(
        requestId,
        senderId,
        message.trim(),
      );

      io.to(room).emit("receive_message", {
        id: savedMessage.id,
        requestId: savedMessage.request_id,
        senderId: savedMessage.sender_id,
        message: savedMessage.message,
        createdAt: savedMessage.created_at,
      });
    } catch (error) {
      console.error("Socket send message error:", error);

      socket.emit("chat_error", {
        message: "Failed to send message",
      });
    }
  });
  socket.on("leave_request", (requestId) => {
    const room = `request_${requestId}`;

    socket.leave(room);

    console.log(`Socket ${socket.id} left ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/chat", chatRoutes);
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "HelpBridge API is running",
      database: "PostgreSQL connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});
app.use("/api/notifications", notificationRoutes);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
