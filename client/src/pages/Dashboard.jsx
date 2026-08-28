import { useEffect, useState } from "react";
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
    FolderSimple,
} from "@phosphor-icons/react";

import { useAuth } from "../context/AuthContext";
import { getNotes, toggleNoteComplete } from "../api/noteApi";
import { getProjects } from "../api/projectApi";

import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import Skeleton from "../components/common/Skeleton";

const priorityLabel = {
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",
};

const priorityIcon = {
    high: <ArrowUp size={14} />,
    medium: <ArrowRight size={14} />,
    low: <ArrowDown size={14} />,
};

function Dashboard() {
    const navigate = useNavigate();

    const { logoutUser } = useAuth();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const [notes, setNotes] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // LOAD DATA
    // =========================

    const loadData = async () => {
        try {
            setLoading(true);

            const [notesRes, projectsRes] = await Promise.all([
                getNotes(),
                getProjects()
            ]);

            setNotes(
                notesRes.data.data ||
                notesRes.data ||
                []
            );

            setProjects(
                projectsRes.data.data ||
                projectsRes.data ||
                []
            );

        } catch (error) {
            console.error(
                "Lỗi lấy dữ liệu:",
                error
            );

            setNotes([]);
            setProjects([]);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================
    // LOGOUT
    // =========================

    const logout = () => {

        logoutUser();

        navigate("/", {
            replace: true
        });

    };

    // =========================
    // COMPLETE NOTE
    // =========================

    const handleToggle = async (id) => {

        try {

            await toggleNoteComplete(id);

            await loadData();

        } catch (error) {

            console.error(
                "Không thể cập nhật Note:",
                error
            );

        }

    };

    // =========================
    // STATISTICS
    // =========================

    const completedNotes = notes.filter(
        (note) =>
            note.status === "completed" ||
            note.status === "done"
    );

    const pendingNotes = notes.filter(
        (note) =>
            note.status === "pending" ||
            note.status === "todo" ||
            note.status === "doing"
    );

    const totalCount = notes.length;

    const completedCount =
        completedNotes.length;

    const pendingCount =
        pendingNotes.length;

    // =========================
    // UPCOMING ITEMS (Notes & Projects)
    // =========================

    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysLater =
        new Date(
            startOfToday.getTime() +
            7 * 24 * 60 * 60 * 1000 +
            23 * 60 * 60 * 1000 +
            59 * 60 * 1000 +
            59 * 1000
        );

    const upcomingProjects = projects
        .filter((project) => {
            if (!project.dueDate) {
                return false;
            }
            const due = new Date(project.dueDate);
            return (
                due >= startOfToday &&
                due <= sevenDaysLater
            );
        })
        .map((project) => ({
            _id: project._id,
            title: project.title,
            date: project.dueDate,
            type: "project",
            priority: null,
        }));

    const upcomingItems = upcomingProjects.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    // =========================
    // RECENT NOTES
    // =========================

    const recentPending =
        pendingNotes.slice(0, 5);

    // =========================
    // TOP CARDS
    // =========================

    const cards = [

        {
            title: "Tổng ghi chú",
            value: totalCount,
            icon: (
                <ChartPieSlice
                    size={24}
                    className="text-accent"
                />
            ),
        },

        {
            title: "Đang chờ",
            value: pendingCount,
            icon: (
                <Clock
                    size={24}
                    className="text-warning"
                />
            ),
        },

        {
            title: "Hoàn thành",
            value: completedCount,
            icon: (
                <CheckCircle
                    size={24}
                    className="text-success"
                />
            ),
        },

    ];

    // =========================
    // RENDER
    // =========================

    return (

        <AppLayout>

            <div className="space-y-6">

                {/* ================= HEADER ================= */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <p className="text-sm font-medium text-muted">
                            Bảng điều khiển
                        </p>

                        <h1 className="text-3xl font-semibold text-ink">
                            Xin chào,{" "}
                            {user?.name || "bạn"} 👋
                        </h1>

                        <p className="text-sm text-muted mt-1">
                            Quản lý công việc và ghi chú
                            của bạn.
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <div className="hidden md:block rounded-full border border-border bg-bg px-4 py-2 text-sm text-muted">

                            {user?.email ||
                                "email@example.com"}

                        </div>

                        <Button
                            variant="secondary"
                            onClick={logout}
                        >

                            <SignOut size={18} />

                            Đăng xuất

                        </Button>

                    </div>

                </div>


                {/* ================= TOP CARDS ================= */}

                {loading ? (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {[1, 2, 3].map(
                            (item) => (

                                <Skeleton
                                    key={item}
                                    className="h-28"
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {cards.map(
                            (item, index) => (

                                <Card
                                    key={index}
                                    className="flex items-center gap-4"
                                >

                                    <div className="w-14 h-14 rounded-2xl bg-bg flex items-center justify-center">

                                        {item.icon}

                                    </div>

                                    <div>

                                        <div className="text-3xl font-semibold text-ink">

                                            {item.value}

                                        </div>

                                        <div className="text-sm text-muted">

                                            {item.title}

                                        </div>

                                    </div>

                                </Card>

                            )
                        )}

                    </div>

                )}


                {/* ================= MAIN ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">


                    {/* UPCOMING */}

                    <div className="lg:col-span-5">

                        <Card className="h-full space-y-4">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <Bell
                                        size={22}
                                        className="text-warning"
                                    />

                                    <div>

                                        <h2 className="text-lg font-semibold text-ink">

                                            Sắp đến hạn

                                        </h2>

                                        <p className="text-xs text-muted">

                                            Công việc trong 7 ngày tới

                                        </p>

                                    </div>

                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        navigate("/projects")
                                    }
                                >

                                    Xem tất cả

                                </Button>

                            </div>


                            {loading ? (

                                <div className="space-y-3">

                                    {[1, 2, 3].map(
                                        (item) => (

                                            <Skeleton
                                                key={item}
                                                className="h-16"
                                            />

                                        )
                                    )}

                                </div>

                            ) : upcomingItems.length === 0 ? (

                                <div className="py-10 text-center">

                                    <Bell
                                        size={32}
                                        className="mx-auto text-muted"
                                    />

                                    <p className="text-sm text-muted mt-3">

                                        Không có công việc hoặc dự án
                                        sắp đến hạn.

                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-2">

                                    {upcomingItems
                                        .slice(0, 6)
                                        .map((item) => (

                                            <button
                                                key={`${item.type}-${item._id}`}
                                                onClick={() =>
                                                    navigate(
                                                        item.type === "note"
                                                            ? `/notes/${item._id}`
                                                            : `/projects/${item._id}`
                                                    )
                                                }
                                                className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-warning/40 hover:shadow-soft"
                                            >

                                                <div className="flex items-center gap-3">

                                                    {item.type === "note" ? (
                                                        <Bell
                                                            size={18}
                                                            className="text-warning"
                                                        />
                                                    ) : (
                                                        <FolderSimple
                                                            size={18}
                                                            className="text-accent"
                                                        />
                                                    )}

                                                    <div>

                                                        <p className="text-sm font-medium text-ink">

                                                            {item.title}

                                                        </p>

                                                        <p className="text-xs text-warning">
                                                            {item.type === "project" ? "Dự án • " : ""}
                                                            {new Date(
                                                                item.date
                                                            ).toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}

                                                        </p>

                                                    </div>

                                                </div>


                                                {item.priority ? (

                                                    <Badge
                                                        tone={
                                                            item.priority
                                                        }
                                                    >

                                                        {
                                                            priorityIcon[
                                                            item.priority
                                                            ]
                                                        }

                                                        {
                                                            priorityLabel[
                                                            item.priority
                                                            ]
                                                        }

                                                    </Badge>

                                                ) : (
                                                    <Badge tone="medium">Project</Badge>
                                                )}

                                            </button>

                                        ))}

                                </div>

                            )}

                        </Card>

                    </div>


                    {/* PENDING */}

                    <div className="lg:col-span-3">

                        <Card className="h-full space-y-4">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <NotePencil
                                        size={22}
                                        className="text-accent"
                                    />

                                    <h2 className="text-lg font-semibold text-ink">

                                        Chưa hoàn thành

                                    </h2>

                                </div>

                                <Button
                                    variant="ghost"
                                    onClick={() =>
                                        navigate("/notes")
                                    }
                                >

                                    Tất cả

                                </Button>

                            </div>


                            {loading ? (

                                <div className="space-y-3">

                                    {[1, 2, 3].map(
                                        (item) => (

                                            <Skeleton
                                                key={item}
                                                className="h-14"
                                            />

                                        )
                                    )}

                                </div>

                            ) : recentPending.length === 0 ? (

                                <div className="py-10 text-center">

                                    <CheckCircle
                                        size={32}
                                        className="mx-auto text-success"
                                    />

                                    <p className="text-sm text-muted mt-3">

                                        Tất cả ghi chú
                                        đã hoàn thành 🎉

                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-2">

                                    {recentPending.map(
                                        (note) => (

                                            <div
                                                key={note._id}
                                                className="flex items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3"
                                            >

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/notes/${note._id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                                                >

                                                    <NotePencil
                                                        size={18}
                                                        className="text-accent shrink-0"
                                                    />

                                                    <span className="text-sm text-ink truncate">

                                                        {note.title}

                                                    </span>

                                                </button>


                                                <button
                                                    onClick={() =>
                                                        handleToggle(
                                                            note._id
                                                        )
                                                    }
                                                    className="flex items-center gap-1 text-xs text-muted hover:text-success transition-colors ml-3"
                                                >

                                                    <Circle
                                                        size={17}
                                                    />

                                                    Xong

                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </Card>

                    </div>

                </div>


                {/* ================= QUICK ACTION ================= */}

                <Card>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h2 className="text-lg font-semibold text-ink">

                                Bạn có công việc mới?

                            </h2>

                            <p className="text-sm text-muted mt-1">

                                Tạo một ghi chú để không
                                bỏ quên công việc.

                            </p>

                        </div>

                        <Button
                            onClick={() =>
                                navigate("/notes/create")
                            }
                        >

                            <NotePencil size={18} />

                            Tạo ghi chú

                        </Button>

                    </div>

                </Card>


                {/* ================= FOOTER ================= */}

                <div className="text-center text-xs text-muted py-4">

                    Note Management System

                </div>

            </div>

        </AppLayout>

    );
}

export default Dashboard;