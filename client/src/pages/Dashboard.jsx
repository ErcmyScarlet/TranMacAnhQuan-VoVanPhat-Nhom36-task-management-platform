import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignOut, CheckCircle, CalendarBlank, ChartPieSlice, UserCircle } from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";

=======
import { useNavigate } from "react-router-dom";
import {
    SignOut,
    CheckCircle,
    Clock,
    Bell,
    ChartPieSlice,
    NotePencil,
    ArrowUp,
    ArrowRight,
    ArrowDown,
    Circle,
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthContext";
import { getNotes, toggleNoteComplete } from "../api/noteApi";
>>>>>>> VoVanPhat-dev
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
<<<<<<< HEAD
import { getTasks } from "../api/taskApi";
import { getProjectById } from "../api/projectApi";

function Dashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [tasks, setTasks] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [loading, setLoading] = useState(true);
    const { logoutUser } = useAuth();

    useEffect(() => {
        setLoading(true);

        const taskPromise = getTasks(projectId)
            .then((res) => setTasks(res.data?.data || []))
            .catch(() => setTasks([]));

        const projectPromise = projectId
            ? getProjectById(projectId)
                  .then((res) => setProjectName(res.data?.title || ""))
                  .catch(() => setProjectName(""))
            : Promise.resolve();

        Promise.all([taskPromise, projectPromise]).finally(() => setLoading(false));
    }, [projectId]);
=======
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
    const [loading, setLoading] = useState(true);

    const loadNotes = () => {
        setLoading(true);
        getNotes()
            .then((res) => setNotes(res.data.data || []))
            .catch(() => setNotes([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleToggle = async (id) => {
        await toggleNoteComplete(id);
        loadNotes();
    };
>>>>>>> VoVanPhat-dev

    const logout = () => {
        logoutUser();
        navigate("/", { replace: true });
    };

<<<<<<< HEAD
    const completedCount = tasks.filter((task) => task.status === "done").length;
    const inProgressCount = tasks.filter((task) => task.status === "doing").length;
    const totalCount = tasks.length;

    const cards = [
        { title: "Hoàn thành", value: completedCount, icon: <CheckCircle size={22} className="text-success" /> },
        { title: "Đang chờ", value: inProgressCount, icon: <CalendarBlank size={22} className="text-accent" /> },
        { title: "Tổng công việc", value: totalCount, icon: <ChartPieSlice size={22} className="text-warning" /> }
    ];

    const getBadgeTone = (status) => {
        if (status === "done") return "done";
        if (status === "doing") return "doing";
        return "todo";
    };

=======
    const completedCount = notes.filter((n) => n.status === "completed").length;
    const pendingCount = notes.filter((n) => n.status === "pending").length;
    const totalCount = notes.length;

    // Notes sắp đến hạn (có reminderDate, chưa hoàn thành, trong 3 ngày tới)
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const upcomingNotes = notes
        .filter(
            (n) =>
                n.status === "pending" &&
                n.reminderDate &&
                new Date(n.reminderDate) <= threeDaysLater &&
                new Date(n.reminderDate) >= now
        )
        .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));

    // Notes chưa hoàn thành gần nhất
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

>>>>>>> VoVanPhat-dev
    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted">
                            Bảng điều khiển
                        </p>
                        <h1 className="text-3xl font-semibold text-ink">
                            Xin chào, {user?.name || "bạn"}
                        </h1>
                    </div>
<<<<<<< HEAD
                    <div className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-2 text-sm text-muted">
                        {user?.email || "email@example.com"}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {cards.map((item, index) => (
                        <Card key={index} className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-bg flex items-center justify-center">{item.icon}</div>
                            <div>
                                <div className="text-2xl font-semibold text-ink">{loading ? "..." : item.value}</div>
                                <div className="text-sm text-muted">{item.title}</div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-ink">Công việc hôm nay</h2>
                            <p className="text-sm text-muted">Nhấn vào công việc để mở trang bình luận</p>
=======
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-2 text-sm text-muted">
                            {user?.email || "email@example.com"}
>>>>>>> VoVanPhat-dev
                        </div>
                        <Button variant="secondary" onClick={logout}>
                            <SignOut size={18} /> Đăng xuất
                        </Button>
                    </div>
                </div>

<<<<<<< HEAD
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <button
                                key={task._id || task.id}
                                type="button"
                                onClick={() => navigate(`/comments/${task._id || task.id}`)}
                                className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-accent hover:shadow-soft"
                            >
                                <div className="flex items-center gap-3">
                                    <UserCircle size={20} className="text-accent" />
                                    <span className="text-sm text-ink">{task.title}</span>
                                </div>
                                <Badge tone={getBadgeTone(task.status)}>{task.badge || task.status}</Badge>
                            </button>
=======
                {/* Stat cards */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24" />
>>>>>>> VoVanPhat-dev
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                        {cards.map((item, index) => (
                            <Card
                                key={index}
                                className="flex items-center gap-4"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-bg flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-ink">
                                        {item.value}
                                    </div>
                                    <div className="text-sm text-muted">
                                        {item.title}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Sắp đến hạn */}
                    <Card className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Bell size={20} className="text-warning" />
                            <h2 className="text-lg font-semibold text-ink">
                                Sắp đến hạn
                            </h2>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <Skeleton key={i} className="h-16" />
                                ))}
                            </div>
                        ) : upcomingNotes.length === 0 ? (
                            <p className="text-sm text-muted py-6 text-center">
                                Không có ghi chú nào sắp đến hạn
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {upcomingNotes.map((note) => (
                                    <button
                                        key={note._id}
                                        onClick={() =>
                                            navigate(`/notes/${note._id}`)
                                        }
                                        className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-warning/40 hover:shadow-soft"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Bell
                                                size={18}
                                                className="text-warning"
                                            />
                                            <div>
                                                <span className="text-sm font-medium text-ink">
                                                    {note.title}
                                                </span>
                                                <p className="text-xs text-warning">
                                                    {new Date(
                                                        note.reminderDate
                                                    ).toLocaleString("vi-VN", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge tone={note.priority}>
                                            {priorityIcon[note.priority]}{" "}
                                            {priorityLabel[note.priority]}
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Ghi chú chưa hoàn thành */}
                    <Card className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <NotePencil
                                    size={20}
                                    className="text-accent"
                                />
                                <h2 className="text-lg font-semibold text-ink">
                                    Chưa hoàn thành
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/notes")}
                            >
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
                                            onClick={() =>
                                                navigate(`/notes/${note._id}`)
                                            }
                                            className="flex items-center gap-3 text-left flex-1"
                                        >
                                            <NotePencil
                                                size={18}
                                                className="text-accent"
                                            />
                                            <span className="text-sm text-ink">
                                                {note.title}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleToggle(note._id)
                                            }
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
