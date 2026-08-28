require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Chạy job nhắc nhở deadline
require("./jobs/deadlineReminder");

// Kết nối database và khởi chạy server
connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
});