const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Lấy header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Không có token"
            });
        }

        // Bearer eyJhbGciOi...
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token không hợp lệ"
            });
        }

        // Giải mã token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Lưu thông tin user
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Token hết hạn hoặc không hợp lệ"
        });

    }

};


module.exports = authMiddleware;