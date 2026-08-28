import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus } from "@phosphor-icons/react";
import { getTasks, updateTask } from "../api/taskApi";
import KanbanBoard from "../components/KanbanBoard";
import TaskForm from "../components/TaskForm";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

function ProjectDetail() {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);

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

  return (
    <div>
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-4">
        <ArrowLeft size={16} />
        Quay lại danh sách Project
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Công việc</h1>
        <Button onClick={() => setOpenForm(true)}>
          <Plus size={16} weight="bold" />
          Thêm task
        </Button>
      </div>

      <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />

      <Modal open={openForm} onClose={() => setOpenForm(false)} title="Thêm task mới">
        <TaskForm
          projectId={projectId}
          onCreated={() => {
            loadTasks();
            setOpenForm(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default ProjectDetail;