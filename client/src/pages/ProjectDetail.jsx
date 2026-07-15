import { useEffect, useState } from "react";
import { getTasks, updateTask } from "../api/taskApi";
import KanbanBoard from "../components/KanbanBoard";

function ProjectDetail({ projectId }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = () => {
    getTasks(projectId).then((res) => setTasks(res.data.data));
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    await updateTask(taskId, { status: newStatus });
  };

  return <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />;
}

export default ProjectDetail;