const express=require("express");

const router=express.Router();

const authMiddleware=require("../middleware/authMiddleware");

const upload=require("../middleware/uploadMiddleware");

const {
    uploadFile,
    getAttachments
}=require("../controllers/uploadController");

router.post(
    "/",
    authMiddleware,
    upload.single("file"),
    uploadFile
);

router.get("/attachments/:projectId",
    authMiddleware,
    getAttachments
);

module.exports=router;