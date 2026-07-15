const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email đã được sử dụng"
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Lưu vào MongoDB
        await user.save();

        // Trả kết quả
        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email có tồn tại không
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng"
            });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Trả kết quả
        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

module.exports = {
    register,
    login
};