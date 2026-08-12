import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Warning, Clock, Bell } from "@phosphor-icons/react";
import { getNotes } from "../api/noteApi";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";

function formatDate(d) {
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Reminders() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotes()
      .then((res) => setNotes(res.data.data || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Ghi chú có reminder đã quá hạn (chưa hoàn thành)
  const overdueNotes = notes.filter(
    (n) =>
      n.status === "pending" &&
      n.reminderDate &&
      new Date(n.reminderDate) < now
  );

  // Ghi chú có reminder sắp đến hạn trong 7 ngày (chưa hoàn thành)
  const upcomingNotes = notes.filter(
    (n) =>
      n.status === "pending" &&
      n.reminderDate &&
      new Date(n.reminderDate) >= now &&
      new Date(n.reminderDate) <= in7days
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Nhắc việc</h1>
        <p className="text-muted text-sm mb-8">
          Ghi chú sắp đến hạn hoặc đã quá hạn nhắc nhở
        </p>

        {overdueNotes.length === 0 && upcomingNotes.length === 0 ? (
          <Card>
            <EmptyState
              title="Không có gì cần nhắc"
              description="Tất cả ghi chú đều trong tầm kiểm soát."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {overdueNotes.length > 0 && (
              <Card>
                <p className="text-sm font-semibold text-danger mb-3">
                  Đã quá hạn nhắc nhở
                </p>
                {overdueNotes.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => navigate(`/notes/${n._id}`)}
                    className="flex w-full items-center justify-between py-3 border-b border-border last:border-0 text-left hover:bg-bg/50 transition-colors rounded-lg px-2"
                  >
                    <div className="flex items-center gap-3">
                      <Warning size={18} className="text-danger" />
                      <span className="text-sm font-medium text-ink">
                        {n.title}
                      </span>
                    </div>
                    <Badge tone="high">{formatDate(n.reminderDate)}</Badge>
                  </button>
                ))}
              </Card>
            )}
            {upcomingNotes.length > 0 && (
              <Card>
                <p className="text-sm font-semibold text-warning mb-3">
                  Sắp đến hạn (7 ngày tới)
                </p>
                {upcomingNotes.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => navigate(`/notes/${n._id}`)}
                    className="flex w-full items-center justify-between py-3 border-b border-border last:border-0 text-left hover:bg-bg/50 transition-colors rounded-lg px-2"
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-warning" />
                      <span className="text-sm font-medium text-ink">
                        {n.title}
                      </span>
                    </div>
                    <Badge tone="medium">{formatDate(n.reminderDate)}</Badge>
                  </button>
                ))}
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Reminders;