import { useEffect, useState } from "react";
import { Warning, Clock } from "@phosphor-icons/react";
import { getReminders } from "../api/dashboardApi";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";

function formatDate(d) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ReminderRow({ icon: Icon, name, dueDate, tone }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <Icon size={18} className={tone === "danger" ? "text-danger" : "text-warning"} />
        <span className="text-sm font-medium text-ink">{name}</span>
      </div>
      <Badge tone={tone === "danger" ? "high" : "medium"}>{formatDate(dueDate)}</Badge>
    </div>
  );
}

function Reminders() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReminders()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  const totalOverdue = (data.overdueTasks?.length || 0) + (data.overdueProjects?.length || 0);
  const totalUpcoming = (data.tasks?.length || 0) + (data.projects?.length || 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Nhắc việc</h1>
      <p className="text-muted text-sm mb-8">Project và task sắp đến hạn hoặc đã quá hạn</p>

      {totalOverdue === 0 && totalUpcoming === 0 ? (
        <Card>
          <EmptyState
            title="Không có gì cần nhắc"
            description="Mọi project và task đều trong tầm kiểm soát."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {totalOverdue > 0 && (
            <Card>
              <p className="text-sm font-semibold text-danger mb-3">Đã quá hạn</p>
              {data.overdueProjects.map((p) => (
                <ReminderRow key={p._id} icon={Warning} name={`Project: ${p.title}`} dueDate={p.dueDate} tone="danger" />
              ))}
              {data.overdueTasks.map((t) => (
                <ReminderRow key={t._id} icon={Warning} name={`Task: ${t.title}`} dueDate={t.dueDate} tone="danger" />
              ))}
            </Card>
          )}
          {totalUpcoming > 0 && (
            <Card>
              <p className="text-sm font-semibold text-warning mb-3">Sắp đến hạn (7 ngày tới)</p>
              {data.projects.map((p) => (
                <ReminderRow key={p._id} icon={Clock} name={`Project: ${p.title}`} dueDate={p.dueDate} tone="warning" />
              ))}
              {data.tasks.map((t) => (
                <ReminderRow key={t._id} icon={Clock} name={`Task: ${t.title}`} dueDate={t.dueDate} tone="warning" />
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default Reminders;