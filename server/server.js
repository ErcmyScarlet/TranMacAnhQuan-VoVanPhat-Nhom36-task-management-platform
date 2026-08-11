require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    app.use("/api/projects", require("./routes/projectRoutes"));
    app.use("/api/tasks", require("./routes/taskRoutes"));
    app.use("/api/dashboard", require("./routes/dashboardRoutes"));

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });