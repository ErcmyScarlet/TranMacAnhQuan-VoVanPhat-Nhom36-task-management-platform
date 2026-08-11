import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadSimple, FileArrowDown, ArrowLeft, File, CloudArrowUp } from "@phosphor-icons/react";

import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormField from "../components/common/FormField";

import { uploadFile, getAttachments } from "../services/attachmentService";

function UploadPage() {
    const navigate = useNavigate();
    const [project, setProject] = useState("");
    const [file, setFile] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");

        if (!project.trim()) {
            setErr("Vui lòng nhập Project ID");
            return;
        }

        if (!file) {
            setErr("Vui lòng chọn file để upload");
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("project", project);
            formData.append("file", file);

            await uploadFile(formData);
            setMsg("Upload thành công!");
            setFile(null);

            const fileInput = document.getElementById("file-input");
            if (fileInput) fileInput.value = "";

            loadFiles();
        } catch (err) {
            setErr(err.response?.data?.message || "Upload thất bại");
        } finally {
            setUploading(false);
        }
    };

    const loadFiles = async () => {
        if (!project.trim()) return;
        try {
            const data = await getAttachments(project);
            setAttachments(data);
        } catch (err) {
            setErr("Không lấy được danh sách file");
        }
    };

    const BASE_URL = "http://localhost:5000";

    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <p className="text-sm font-medium text-muted">Tệp đính kèm</p>
                        <h1 className="text-2xl font-semibold text-ink">Upload Attachment</h1>
                    </div>
                </div>

                <Card className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <CloudArrowUp size={22} className="text-accent" weight="duotone" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-ink">Upload file</h2>
                            <p className="text-sm text-muted">Đính kèm file vào project</p>
                        </div>
                    </div>

                    {msg && (
                        <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
                            <UploadSimple size={18} /> {msg}
                        </div>
                    )}
                    {err && (
                        <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
                            {err}
                        </div>
                    )}

                    <form onSubmit={handleUpload} className="space-y-4">
                        <FormField label="Project ID" id="project-id">
                            <Input
                                id="project-id"
                                type="text"
                                placeholder="Nhập ID của project"
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                required
                            />
                        </FormField>

                        <FormField label="Chọn file" id="file-input">
                            <input
                                id="file-input"
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full text-sm text-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-border file:text-sm file:font-medium file:bg-surface file:text-ink hover:file:bg-bg file:cursor-pointer file:transition-colors"
                            />
                        </FormField>

                        <div className="flex gap-3">
                            <Button type="submit" disabled={uploading}>
                                <UploadSimple size={18} />
                                {uploading ? "Đang upload..." : "Upload"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={loadFiles}>
                                <FileArrowDown size={18} /> Xem danh sách file
                            </Button>
                        </div>
                    </form>
                </Card>

                {attachments.length > 0 && (
                    <Card className="space-y-4">
                        <h3 className="text-lg font-semibold text-ink">
                            Danh sách Attachment ({attachments.length})
                        </h3>
                        <div className="space-y-2">
                            {attachments.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between rounded-xl border border-border bg-bg px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <File size={20} className="text-accent" />
                                        <div>
                                            <p className="text-sm font-medium text-ink">{item.originalName}</p>
                                            <p className="text-xs text-muted">
                                                {item.uploadedBy?.name || "Unknown"} • {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`${BASE_URL}/${item.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface transition-colors"
                                    >
                                        <FileArrowDown size={14} /> Tải về
                                    </a>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

export default UploadPage;