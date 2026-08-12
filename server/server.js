require("dotenv").config();
    const express = require("express");
    const cors = require("cors");
    const connectDB = require("./config/db");

    connectDB();
    require("./jobs/deadlineReminder");
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/api/projects", require("./routes/projectRoutes"));
    app.use("/api/tasks", require("./routes/taskRoutes"));
    app.use("/api/dashboard", require("./routes/dashboardRoutes"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`${PORT}`));