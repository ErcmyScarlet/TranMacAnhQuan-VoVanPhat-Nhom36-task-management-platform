import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createComment, getComments } from "../services/commentService";

function CommentPage() {
    const navigate = useNavigate();
    const { projectId: routeProjectId } = useParams();
    const [projectId, setProjectId] = useState(routeProjectId || "");
    const [content, setContent] = useState("");
    const [comments, setComments] = useState([]);

    const loadComments = useCallback(async (selectedProjectId = projectId) => {
        if (!selectedProjectId) return;

        try {
            const data = await getComments(selectedProjectId);
            setComments(data);
        } catch (err) {
            alert(err.response?.data?.message || "Không lấy được comment");
        }
    }, [projectId]);

    useEffect(() => {
        if (routeProjectId) {
            setProjectId(routeProjectId);
            loadComments(routeProjectId);
        }
    }, [routeProjectId, loadComments]);

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!projectId.trim()) {
            alert("Vui lòng chọn công việc trước");
            return;
        }

        try {
            await createComment({
                project: projectId,
                content
            });

            alert("Thêm comment thành công");
            setContent("");
            loadComments(projectId);
        } catch (err) {
            alert(err.response?.data?.message || "Có lỗi");
        }
    };

    return (
        <div className="min-h-screen bg-bg p-6 text-ink">
            <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold">Bình luận công việc</h2>
                        <p className="mt-1 text-sm text-muted">
                            {projectId ? `Đang mở công việc: ${projectId}` : "Chọn một công việc để bắt đầu bình luận"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-2xl border border-border px-4 py-2 font-medium text-ink"
                    >
                        ← Quay lại dashboard
                    </button>
                </div>

                <form onSubmit={handleCreate} className="mt-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Project ID"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-bg px-4 py-3 outline-none ring-0"
                    />

                    <textarea
                        rows="4"
                        placeholder="Nhập nội dung comment"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full rounded-2xl border border-border bg-bg px-4 py-3 outline-none ring-0"
                    />

                    <div className="flex gap-3">
                        <button type="submit" className="rounded-2xl bg-accent px-4 py-2 font-medium text-white">
                            Thêm Comment
                        </button>
                        <button
                            type="button"
                            onClick={() => loadComments(projectId)}
                            className="rounded-2xl border border-border px-4 py-2 font-medium text-ink"
                        >
                            Tải lại
                        </button>
                    </div>
                </form>

                <hr className="my-6 border-border" />

                <h3 className="text-lg font-semibold">Danh sách Comment</h3>

                {comments.length === 0 ? (
                    <p className="mt-3 text-sm text-muted">Chưa có comment.</p>
                ) : (
                    <div className="mt-4 space-y-3">
                        {comments.map((comment) => (
                            <div key={comment._id} className="rounded-2xl border border-border bg-bg p-4">
                                <p className="font-medium text-ink">
                                    {comment.author?.name || comment.author?.email || "Unknown"}
                                </p>
                                <p className="mt-1 text-sm text-muted">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommentPage;