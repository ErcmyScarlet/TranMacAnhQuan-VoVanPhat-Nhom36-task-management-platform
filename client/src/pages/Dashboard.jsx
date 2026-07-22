import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../api/axios";
import Card from "../components/common/Card";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data.data));
  }, []);

  if (!stats) return <p className="text-muted text-sm">Đang tải...</p>;

  const total = stats.byStatus.reduce((sum, s) => sum + s.count, 0);
  const chartData = {
    labels: stats.byStatus.map((s) => s._id),
    datasets: [
      {
        data: stats.byStatus.map((s) => s.count),
        backgroundColor: ["#667085", "#F79009", "#12B76A"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <Card>
          <p className="text-sm text-muted mb-1">Tổng số task</p>
          <p className="text-3xl font-display font-semibold">{total}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-1">Quá hạn</p>
          <p className="text-3xl font-display font-semibold text-danger">{stats.overdue}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-1">Hoàn thành</p>
          <p className="text-3xl font-display font-semibold text-success">
            {stats.byStatus.find((s) => s._id === "done")?.count || 0}
          </p>
        </Card>
      </div>
      <Card className="max-w-md">
        <p className="text-sm font-medium mb-4">Phân bố theo trạng thái</p>
        <Doughnut data={chartData} />
      </Card>
    </div>
  );
}

export default Dashboard;