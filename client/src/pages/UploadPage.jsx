import { useState } from "react";
import {
    uploadFile,
    getAttachments
} from "../services/attachmentService";

function UploadPage() {

    const [project, setProject] = useState("");
    const [file, setFile] = useState(null);
    const [attachments, setAttachments] = useState([]);

    const handleUpload = async (e) => {

        e.preventDefault();

        if (!file) {
            return alert("Chọn file trước");
        }

        try {

            const formData = new FormData();

            formData.append("project", project);
            formData.append("file", file);

            await uploadFile(formData);

            alert("Upload thành công");

            loadFiles();

        } catch (err) {

            console.log(err);

            alert(err.response?.data?.message || "Upload thất bại");

        }

    };

    const loadFiles = async () => {

        try {

            const data = await getAttachments(project);

            setAttachments(data);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div style={{ padding: 20 }}>

            <h2>Upload Attachment</h2>

            <input
                placeholder="Project ID"
                value={project}
                onChange={(e)=>setProject(e.target.value)}
            />

            <br /><br />

            <input
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
            />

            <br /><br />

            <button onClick={handleUpload}>
                Upload
            </button>

            <button
                onClick={loadFiles}
                style={{ marginLeft: 10 }}
            >
                Xem File
            </button>

            <hr />

            {
                attachments.map(item => (

                    <div key={item._id}>

                        <p>{item.originalName}</p>

                    </div>

                ))
            }

        </div>

    );

}

export default UploadPage;