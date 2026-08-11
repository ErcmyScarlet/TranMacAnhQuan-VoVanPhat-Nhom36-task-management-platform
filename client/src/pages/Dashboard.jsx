import { useNavigate } from "react-router-dom";
import { SignOut, CheckCircle, CalendarBlank, ChartPieSlice, UserCircle } from "@phosphor-icons/react";

import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();
    const { user, logoutUser } = useAuth();

    const logout = () => {
        logoutUser();
        navigate("/", { replace: true });
    };

    const cards = [
        { title: "Hoàn thành", value: "12", icon: <CheckCircle size={22} className="text-success" /> },
        { title: "Đang chờ", value: "5", icon: <CalendarBlank size={22} className="text-accent" /> },
        { title: "Tổng công việc", value: "24", icon: <ChartPieSlice size={22} className="text-warning" /> }
    ];

    const tasks = [
        { id: "task-1", title: "Hoàn thành báo cáo tuần", status: "done", badge: "Hoàn thành" },
        { id: "task-2", title: "Gặp khách hàng", status: "doing", badge: "Đang làm" },
        { id: "task-3", title: "Chuẩn bị sprint review", status: "todo", badge: "Sắp tới" }
    ];

    const getBadgeTone = (status) => {
        if (status === "done") return "done";
        if (status === "doing") return "doing";
        return "todo";
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted">Bảng điều khiển</p>
                        <h1 className="text-3xl font-semibold text-ink">Xin chào, {user?.name || "bạn"}</h1>
                    </div>
                    <div className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-2 text-sm text-muted">
                        {user?.email || "email@example.com"}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {cards.map((item, index) => (
                        <Card key={index} className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-bg flex items-center justify-center">{item.icon}</div>
                            <div>
                                <div className="text-2xl font-semibold text-ink">{item.value}</div>
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
                        </div>
                        <Button variant="secondary" onClick={logout}>
                            <SignOut size={18} /> Đăng xuất
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <button
                                key={task.id}
                                type="button"
                                onClick={() => navigate(`/comments/${task.id}`)}
                                className="flex w-full items-center justify-between rounded-2xl border border-border bg-bg px-4 py-3 text-left transition hover:border-accent hover:shadow-soft"
                            >
                                <div className="flex items-center gap-3">
                                    <UserCircle size={20} className="text-accent" />
                                    <span className="text-sm text-ink">{task.title}</span>
                                </div>
                                <Badge tone={getBadgeTone(task.status)}>{task.badge}</Badge>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

export default Dashboard;