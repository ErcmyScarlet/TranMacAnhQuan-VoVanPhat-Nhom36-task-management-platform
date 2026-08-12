import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { createNote } from "../api/noteApi";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormField from "../components/common/FormField";

function NoteCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        content: "",
        priority: "medium",
        reminderDate: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) {
            setError("Vui lòng nhập tiêu đề");
            return;
        }

        try {
            setSubmitting(true);
            await createNote({
                title: form.title,
                content: form.content,
                priority: form.priority,
                reminderDate: form.reminderDate || null,
            });
            navigate("/notes");
        } catch (err) {
            setError(err.response?.data?.error || "Tạo ghi chú thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/notes")}
                        className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <p className="text-sm font-medium text-muted">
                            Ghi chú
                        </p>
                        <h1 className="text-2xl font-semibold text-ink">
                            Tạo ghi chú mới
                        </h1>
                    </div>
                </div>

                <Card>
                    {error && (
                        <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Tiêu đề" id="note-title">
                            <Input
                                id="note-title"
                                name="title"
                                placeholder="Nhập tiêu đề ghi chú"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </FormField>

                        <FormField label="Nội dung" id="note-content">
                            <textarea
                                id="note-content"
                                name="content"
                                rows={5}
                                placeholder="Nhập nội dung chi tiết..."
                                value={form.content}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                            />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField label="Mức ưu tiên" id="note-priority">
                                <select
                                    id="note-priority"
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                                >
                                    <option value="low">Thấp</option>
                                    <option value="medium">Trung bình</option>
                                    <option value="high">Cao</option>
                                </select>
                            </FormField>

                            <FormField
                                label="Nhắc nhở"
                                id="note-reminder"
                                helper="Đặt ngày giờ để nhận nhắc nhở"
                            >
                                <Input
                                    id="note-reminder"
                                    name="reminderDate"
                                    type="datetime-local"
                                    value={form.reminderDate}
                                    onChange={handleChange}
                                />
                            </FormField>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={submitting}>
                                <FloppyDisk size={18} />
                                {submitting ? "Đang lưu..." : "Lưu ghi chú"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate("/notes")}
                            >
                                Hủy
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

export default NoteCreate;
