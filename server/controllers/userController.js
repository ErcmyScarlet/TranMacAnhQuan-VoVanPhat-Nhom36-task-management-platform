const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req,res)=>{

    try{

        const user = await User.findById(req.user.id)
            .select("-password");

        res.json(user);

    }catch(err){

        res.status(500).json({
            message:"Lỗi server"
        });

    }

};
const updateProfile = async (req,res)=>{

    try{

        const {name} = req.body;

        const user = await User.findById(req.user.id);

        user.name = name;

        await user.save();

        res.json({
            message:"Cập nhật thành công",
            user
        });

    }catch(err){

        res.status(500).json({
            message:"Lỗi server"
        });

    }

};
const getUsers = async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });

    }
};

const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            message: "Đổi mật khẩu thành công"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });

    }
};
const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });

    }
};

module.exports = {
    getProfile,
    updateProfile,
    getUsers,
    getAllUsers,
    changePassword
};