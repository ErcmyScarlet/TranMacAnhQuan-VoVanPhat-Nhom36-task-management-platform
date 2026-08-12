import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    SignOut,
    CheckCircle,
    Clock,
    Bell,
    ChartPieSlice,
    NotePencil,
    FolderSimple,
    ArrowUp,
    ArrowRight,
    ArrowDown,
    Circle,
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { getNotes, toggleNoteComplete } from "../api/noteApi";
import { getProjects } from "../api/projectApi";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Skeleton from "../components/common/Skeleton";

const priorityLabel = { high: "Cao", medium: "Trung bình", low: "Thấp" };
const priorityIcon = {
    high: <ArrowUp size={14} />,
    medium: <ArrowRight size={14} />,
    low: <ArrowDown size={14} />,
};

function Dashboard() {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [notes, setNotes] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            getNotes().then((res) => setNotes(res.data.data || [])).catch(() => setNotes([])),
            getProjects().then((res) => setProjects(res.data.data || res.data || [])).catch(() => setProjects([])),
        ]).finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleToggle = async (id) => {
        await toggleNoteComplete(id);
        loadData();
    };

    const logout = () => {
        logoutUser();
        navigate("/", { replace: true });
    };

    const completedCount = notes.filter((n) => n.status === "completed").length;
    const pendingCount = notes.filter((n) => n.status === "pending").length;
    const totalCount = notes.length;

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Notes sắp đến hạn (reminderDate trong 7 ngày)
    const upcomingNotes = notes
        .filter(
            (n) =>
                n.status === "pending" &&
                n.reminderDate &&
                new Date(n.reminderDate) <= sevenDaysLater &&
                new Date(n.reminderDate) >= now
        )
        .map((n) => ({
            _id: n._id,
            title: n.title,
            date: n.reminderDate,
            type: "note",
            priority: n.priority,
        }));

    // Projects sắp đến hạn (dueDate trong 7 ngày)
    const upcomingProjects = projects
        .filter(
            (p) =>
                p.dueDate &&
                new Date(p.dueDate) <= sevenDaysLater &&
                new Date(p.dueDate) >= now
        )
        .map((p) => ({
            _id: p._id,
            title: p.title,
            date: p.dueDate,
            type: "project",
            priority: null,
        }));

    // Gộp và sắp xếp theo ngày
    const upcomingItems = [...upcomingNotes, ...upcomingProjects].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const recentPending = notes
        .filter((n) => n.status === "pending")
        .slice(0, 5);

    const cards = [
        {
            title: "Hoàn thành",
            value: completedCount,
            icon: <CheckCircle size={22} className="text-success" />,
        },
        {
            title: "Đang chờ",
            value: pendingCount,
            icon: <Clock size={22} className="text-accent" />,
        },
        {
            title: "Tổng ghi chú",
            value: totalCount,
            icon: <ChartPieSlice size={22} className="text-warning" />,
        },
    ];

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted">Bảng điều khiển</p>
                        <h1 className="text-3xl font-semibold text-ink">
                            Xin chào, {user?.name || "bạn"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-2 text-sm text-muted">
                            {user?.email || "email@example.com"}
                        </div>
                        <Button variant="secondary" onClick={logout}>
                            <SignOut size={18} /> Đăng xuất
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {cards.map((item, index) => (
                            <Card key={index} className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-bg flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-ink">{item.value}</div>
                                    <div className="text-sm text-muted">{item.title}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Bell size={20} className="text-warning" />
                            <h2 className="text-lg font-semibold text-ink">Sắp đến hạn</h2>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <Skeleton key={i} className="h-16" />
                                ))}
                            </div>
                        ) : upcomingItems.length === 0 ? (
                            <p className="text-sm text-muted py-6 text-center">
                                Không có gì sắp đến hạn
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {upcomingItems.map((item) => (
                                    <button
                                        key={`${item.type}-${item._id}`}
                                        onClick={() =>
                                            navigate(
                                                item.type === "note"
                                                    ? `/notes/${item._id}`
                                                    : `/projects`
                                            )
                                        }
                                        className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-warning/40 hover:shadow-soft"
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.type === "note" ? (
                                                <Bell size={18} className="text-warning" />
                                            ) : (
                                                <FolderSimple size={18} className="text-accent" />
                                            )}
                                            <div>
                                                <span className="text-sm font-medium text-ink">{item.title}</span>
                                                <p className="text-xs text-warning">
                                                    {item.type === "project" ? "Project • " : ""}
                                                    {new Date(item.date).toLocaleString("vi-VN", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {item.priority ? (
                                            <Badge tone={item.priority}>
                                                {priorityIcon[item.priority]} {priorityLabel[item.priority]}
                                            </Badge>
                                        ) : (
                                            <Badge tone="medium">Project</Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <NotePencil size={20} className="text-accent" />
                                <h2 className="text-lg font-semibold text-ink">Chưa hoàn thành</h2>
                            </div>
                            <Button variant="ghost" onClick={() => navigate("/notes")}>
                                Xem tất cả
                            </Button>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-14" />
                                ))}
                            </div>
                        ) : recentPending.length === 0 ? (
                            <p className="text-sm text-muted py-6 text-center">
                                Tất cả ghi chú đã hoàn thành 🎉
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {recentPending.map((note) => (
                                    <div
                                        key={note._id}
                                        className="flex items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 transition hover:border-accent/40"
                                    >
                                        <button
                                            onClick={() => navigate(`/notes/${note._id}`)}
                                            className="flex items-center gap-3 text-left flex-1"
                                        >
                                            <NotePencil size={18} className="text-accent" />
                                            <span className="text-sm text-ink">{note.title}</span>
                                        </button>
                                        <button
                                            onClick={() => handleToggle(note._id)}
                                            className="flex items-center gap-1 text-xs text-muted hover:text-success transition-colors ml-3"
                                        >
                                            <Circle size={16} />
                                            Xong
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;
