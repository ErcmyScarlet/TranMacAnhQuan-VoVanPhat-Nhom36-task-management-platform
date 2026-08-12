import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    NotePencil,
    CheckCircle,
    Circle,
    Trash,
    Bell,
    ArrowUp,
    ArrowRight,
    ArrowDown,
} from "@phosphor-icons/react";
import { getNotes, deleteNote, toggleNoteComplete } from "../api/noteApi";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";

const priorityLabel = { high: "Cao", medium: "Trung bình", low: "Thấp" };
const priorityIcon = {
    high: <ArrowUp size={14} />,
    medium: <ArrowRight size={14} />,
    low: <ArrowDown size={14} />,
};

function NoteList() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all | pending | completed

    const loadNotes = () => {
        setLoading(true);
        getNotes()
            .then((res) => setNotes(res.data.data))
            .catch(() => setNotes([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
        await deleteNote(id);
        loadNotes();
    };

    const handleToggle = async (e, id) => {
        e.stopPropagation();
        await toggleNoteComplete(id);
        loadNotes();
    };

    const filtered = notes.filter((n) => {
        if (filter === "all") return true;
        return n.status === filter;
    });

    const counts = {
        all: notes.length,
        pending: notes.filter((n) => n.status === "pending").length,
        completed: notes.filter((n) => n.status === "completed").length,
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-ink">
                            Ghi chú của bạn
                        </h1>
                        <p className="text-muted text-sm mt-1">
                            Quản lý tất cả ghi chú và nhắc việc
                        </p>
                    </div>
                    <Button onClick={() => navigate("/notes/create")}>
                        <Plus size={16} weight="bold" />
                        Tạo ghi chú
                    </Button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2">
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "pending", label: "Đang chờ" },
                        { key: "completed", label: "Hoàn thành" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                filter === tab.key
                                    ? "bg-accent text-white"
                                    : "bg-surface border border-border text-muted hover:text-ink"
                            }`}
                        >
                            {tab.label} ({counts[tab.key]})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-40" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <Card>
                        <EmptyState
                            title="Chưa có ghi chú nào"
                            description="Tạo ghi chú đầu tiên để bắt đầu quản lý công việc."
                            action={
                                <Button
                                    onClick={() => navigate("/notes/create")}
                                >
                                    Tạo ghi chú
                                </Button>
                            }
                        />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((note) => (
                            <Card
                                key={note._id}
                                className="hover:border-accent/40 transition-colors cursor-pointer group"
                                onClick={() =>
                                    navigate(`/notes/${note._id}`)
                                }
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <NotePencil
                                            size={20}
                                            className="text-accent"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Badge tone={note.priority}>
                                            {priorityIcon[note.priority]}{" "}
                                            {priorityLabel[note.priority]}
                                        </Badge>
                                    </div>
                                </div>

                                <div
                                    className={`font-display font-semibold mb-1 ${
                                        note.status === "completed"
                                            ? "line-through text-muted"
                                            : "text-ink"
                                    }`}
                                >
                                    {note.title}
                                </div>
                                <p className="text-sm text-muted line-clamp-2 mb-4">
                                    {note.content || "Chưa có nội dung"}
                                </p>

                                {note.reminderDate && (
                                    <div className="flex items-center gap-1.5 text-xs text-warning mb-3">
                                        <Bell size={14} />
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

                                <div className="flex items-center justify-between pt-3 border-t border-border">
                                    <button
                                        onClick={(e) =>
                                            handleToggle(e, note._id)
                                        }
                                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                            note.status === "completed"
                                                ? "text-success"
                                                : "text-muted hover:text-success"
                                        }`}
                                    >
                                        {note.status === "completed" ? (
                                            <CheckCircle
                                                size={16}
                                                weight="fill"
                                            />
                                        ) : (
                                            <Circle size={16} />
                                        )}
                                        {note.status === "completed"
                                            ? "Hoàn thành"
                                            : "Đánh dấu xong"}
                                    </button>
                                    <button
                                        onClick={(e) =>
                                            handleDelete(e, note._id)
                                        }
                                        className="text-xs text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-all"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

export default NoteList;
