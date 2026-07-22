const Attachment = require("../models/Attachment");
const Project = require("../models/Project");

const uploadFile = async (req,res)=>{

    try{

        const {project}=req.body;

        const existingProject=await Project.findById(project);

        if(!existingProject){

            return res.status(404).json({
                message:"Project không tồn tại"
            });

        }

        if(!req.file){

            return res.status(400).json({
                message:"Chưa chọn file"
            });

        }

        const attachment=await Attachment.create({

            filename:req.file.filename,

            originalName:req.file.originalname,

            path:req.file.path,

            project,

            uploadedBy:req.user.id

        });

        res.status(201).json({

            message:"Upload thành công",

            attachment

        });

    }catch(err){

        console.error(err);

        res.status(500).json({
            message:"Lỗi server"
        });

    }

};
const getAttachments = async (req,res)=>{

    try{

        const attachments=await Attachment.find({

            project:req.params.projectId

        })
        .populate("uploadedBy","name")
        .sort({createdAt:-1});

        res.json(attachments);

    }catch(err){

        console.error(err);

        res.status(500).json({
            message:"Lỗi server"
        });

    }

};

module.exports={
    uploadFile,
    getAttachments
};