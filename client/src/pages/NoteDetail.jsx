import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    FloppyDisk,
    Trash,
    CheckCircle,
    Circle,
    Bell,
    PencilSimple,
} from "@phosphor-icons/react";
import { getNoteById, updateNote, deleteNote, toggleNoteComplete } from "../api/noteApi";
import { getNoteComments, createComment, deleteComment as deleteCommentApi } from "../services/commentService";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Input from "../components/common/Input";
import FormField from "../components/common/FormField";

const priorityLabel = { high: "Cao", medium: "Trung bình", low: "Thấp" };

function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        title: "",
        content: "",
        priority: "medium",
        reminderDate: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const loadNote = async () => {
        try {
            setLoading(true);
            const res = await getNoteById(id);
            const data = res.data.data;
            setNote(data);
            setForm({
                title: data.title || "",
                content: data.content || "",
                priority: data.priority || "medium",
                reminderDate: data.reminderDate
                    ? new Date(data.reminderDate).toISOString().slice(0, 16)
                    : "",
            });
        } catch {
            setError("Không tìm thấy ghi chú");
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            setCommentLoading(true);
            const data = await getNoteComments(id);
            setComments(data || []);
        } catch (err) {
            console.error("Lỗi lấy bình luận:", err);
        } finally {
            setCommentLoading(false);
        }
    };

    useEffect(() => {
        loadNote();
        loadComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setCommentSubmitting(true);
            await createComment({
                note: id,
                content: newComment
            });
            setNewComment("");
            await loadComments();
        } catch (err) {
            console.error("Lỗi gửi bình luận:", err);
            setError(err.response?.data?.message || "Không thể gửi bình luận");
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        try {
            await deleteCommentApi(commentId);
            await loadComments();
        } catch (err) {
            console.error("Lỗi xóa bình luận:", err);
            setError("Không thể xóa bình luận");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setSaving(true);
            await updateNote(id, {
                title: form.title,
                content: form.content,
                priority: form.priority,
                reminderDate: form.reminderDate || null,
            });
            setEditing(false);
            loadNote();
        } catch (err) {
            setError(err.response?.data?.error || "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async () => {
        await toggleNoteComplete(id);
        loadNote();
    };

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
        await deleteNote(id);
        navigate("/notes");
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="space-y-4 max-w-2xl">
                    <div className="h-8 w-48 bg-border/60 rounded-lg animate-pulse" />
                    <div className="h-64 bg-border/60 rounded-2xl animate-pulse" />
                </div>
            </AppLayout>
        );
    }

    if (error && !note) {
        return (
            <AppLayout>
                <div className="max-w-2xl space-y-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/notes")}
                            className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-2xl font-semibold text-ink">
                            Ghi chú
                        </h1>
                    </div>
                    <Card>
                        <div className="text-center py-12 text-muted">
                            {error}
                        </div>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/notes")}
                        className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted">
                            Chi tiết ghi chú
                        </p>
                        <h1 className="text-2xl font-semibold text-ink">
                            {note.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            tone={
                                note.status === "completed" ? "done" : "doing"
                            }
                        >
                            {note.status === "completed"
                                ? "Hoàn thành"
                                : "Đang chờ"}
                        </Badge>
                        <Badge tone={note.priority}>
                            {priorityLabel[note.priority]}
                        </Badge>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
                        {error}
                    </div>
                )}

                {/* Content card */}
                <Card>
                    {editing ? (
                        <form onSubmit={handleSave} className="space-y-5">
                            <FormField label="Tiêu đề" id="edit-title">
                                <Input
                                    id="edit-title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </FormField>

                            <FormField label="Nội dung" id="edit-content">
                                <textarea
                                    id="edit-content"
                                    name="content"
                                    rows={6}
                                    value={form.content}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                                />
                            </FormField>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField
                                    label="Mức ưu tiên"
                                    id="edit-priority"
                                >
                                    <select
                                        id="edit-priority"
                                        name="priority"
                                        value={form.priority}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                                    >
                                        <option value="low">Thấp</option>
                                        <option value="medium">
                                            Trung bình
                                        </option>
                                        <option value="high">Cao</option>
                                    </select>
                                </FormField>

                                <FormField
                                    label="Nhắc nhở"
                                    id="edit-reminder"
                                >
                                    <Input
                                        id="edit-reminder"
                                        name="reminderDate"
                                        type="datetime-local"
                                        value={form.reminderDate}
                                        onChange={handleChange}
                                    />
                                </FormField>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={saving}>
                                    <FloppyDisk size={18} />
                                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setEditing(false)}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="prose prose-sm max-w-none text-ink whitespace-pre-wrap">
                                {note.content || (
                                    <span className="text-muted italic">
                                        Chưa có nội dung
                                    </span>
                                )}
                            </div>

                            {note.reminderDate && (
                                <div className="flex items-center gap-2 rounded-xl bg-warning/10 border border-warning/20 px-4 py-3 text-sm text-warning">
                                    <Bell size={18} />
                                    Nhắc nhở:{" "}
                                    {new Date(
                                        note.reminderDate
                                    ).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            )}

                            <div className="text-xs text-muted">
                                Tạo lúc:{" "}
                                {new Date(note.createdAt).toLocaleString(
                                    "vi-VN"
                                )}
                                {note.updatedAt !== note.createdAt && (
                                    <>
                                        {" "}
                                        • Cập nhật:{" "}
                                        {new Date(
                                            note.updatedAt
                                        ).toLocaleString("vi-VN")}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Actions */}
                {!editing && (
                    <div className="flex gap-3">
                        <Button onClick={() => setEditing(true)}>
                            <PencilSimple size={18} />
                            Chỉnh sửa
                        </Button>
                        <Button variant="secondary" onClick={handleToggle}>
                            {note.status === "completed" ? (
                                <>
                                    <Circle size={18} />
                                    Đánh dấu chưa xong
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Hoàn thành
                                </>
                            )}
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            <Trash size={18} />
                            Xóa
                        </Button>
                    </div>
                )}

                {/* Comments Section */}
                <div className="space-y-4 border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-ink">
                        Bình luận ({comments.length})
                    </h3>

                    {/* Write comment */}
                    <form onSubmit={handleCommentSubmit} className="space-y-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                            disabled={commentSubmitting}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={commentSubmitting || !newComment.trim()}>
                                {commentSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                            </Button>
                        </div>
                    </form>

                    {/* Comments list */}
                    {commentLoading ? (
                        <div className="space-y-3">
                            <div className="h-12 bg-border/40 rounded-xl animate-pulse" />
                            <div className="h-12 bg-border/40 rounded-xl animate-pulse" />
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-sm text-muted italic py-4">Chưa có bình luận nào.</p>
                    ) : (
                        <div className="space-y-3">
                            {comments.map((comment) => {
                                const currentUserId = user?.id || user?._id;
                                const canDelete = comment.author?._id === currentUserId || comment.author === currentUserId;
                                return (
                                    <div key={comment._id} className="flex gap-3 items-start bg-surface border border-border p-4 rounded-2xl">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-ink">
                                                    {comment.author?.name || "Người dùng"}
                                                </span>
                                                <span className="text-[10px] text-muted">
                                                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-ink whitespace-pre-wrap">{comment.content}</p>
                                        </div>
                                        {canDelete && (
                                            <button
                                                onClick={() => handleCommentDelete(comment._id)}
                                                className="text-muted hover:text-danger p-1 rounded transition-colors"
                                                title="Xóa bình luận"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default NoteDetail;
