import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, PaperPlaneRight, Trash } from "@phosphor-icons/react";
import { getTasks, updateTask } from "../api/taskApi";
import { getProjectById } from "../api/projectApi";
import { getTaskComments, createComment, deleteComment } from "../services/commentService";
import { useAuth } from "../context/AuthContext";
import KanbanBoard from "../components/KanbanBoard";
import TaskForm from "../components/TaskForm";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Badge from "../components/common/Badge";
import AppLayout from "../components/layout/AppLayout";

function ProjectDetail() {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskComments, setTaskComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const loadTasks = () => {
    getTasks(projectId)
      .then((res) => setTasks(res.data.data || res.data || []))
      .catch(() => setTasks([]));
  };

  const loadProject = () => {
    getProjectById(projectId)
      .then((res) => setProject(res.data || res))
      .catch(() => setProject(null));
  };

  useEffect(() => {
    loadTasks();
    loadProject();
  }, [projectId]);

  const loadTaskComments = (taskId) => {
    getTaskComments(taskId)
      .then((res) => setTaskComments(res.data || res || []))
      .catch(() => setTaskComments([]));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    loadTaskComments(task._id);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;

    try {
      const res = await createComment({
        task: selectedTask._id,
        content: newComment.trim()
      });
      setNewComment("");
      if (res && res.comment) {
        setTaskComments((prev) => [...prev, res.comment]);
      } else {
        loadTaskComments(selectedTask._id);
      }
    } catch (err) {
      alert("Lỗi khi thêm bình luận");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedTask) return;
    try {
      await deleteComment(commentId);
      setTaskComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Lỗi khi xóa bình luận");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    await updateTask(taskId, { status: newStatus });
  };

  return (
    <AppLayout>
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

        <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} onTaskClick={handleTaskClick} />

        {/* Modal thêm task */}
        <Modal open={openForm} onClose={() => setOpenForm(false)} title="Thêm task mới">
          <TaskForm
            projectId={projectId}
            members={project?.memberIds || []}
            onCreated={() => {
              loadTasks();
              setOpenForm(false);
            }}
          />
        </Modal>

        {/* Modal chi tiết Task & Bình luận */}
        <Modal open={!!selectedTask} onClose={() => setSelectedTask(null)} title={selectedTask?.title || "Chi tiết Task"}>
          {selectedTask && (
            <div className="space-y-4 text-ink">
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Mô tả</span>
                <p className="text-sm mt-1 text-ink bg-bg p-3 rounded-xl border border-border">
                  {selectedTask.description || "Chưa có mô tả cho task này."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Người thực hiện</span>
                  <select
                    value={selectedTask.assigneeId?._id || selectedTask.assigneeId || ""}
                    onChange={async (e) => {
                      const newAssigneeId = e.target.value || null;
                      try {
                        const res = await updateTask(selectedTask._id, { assigneeId: newAssigneeId });
                        const updated = res.data?.data || res.data;
                        setTasks(prev => prev.map(t => t._id === selectedTask._id ? { ...t, assigneeId: updated?.assigneeId } : t));
                        setSelectedTask(prev => ({ ...prev, assigneeId: updated?.assigneeId }));
                      } catch (err) {
                        alert("Lỗi khi cập nhật người thực hiện");
                      }
                    }}
                    className="mt-1 w-full rounded-xl border border-border bg-bg px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent transition-colors"
                  >
                    <option value="">Chưa phân công</option>
                    {(project?.memberIds || []).map(m => (
                      <option key={m._id} value={m._id}>{m.name || m.email}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Hạn chót</span>
                  <p className="text-sm mt-2 text-ink font-medium">
                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString("vi-VN") : "Chưa đặt hạn"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider block">Độ ưu tiên</span>
                  <div className="mt-1">
                    <Badge tone={selectedTask.priority}>{selectedTask.priority}</Badge>
                  </div>
                </div>
              </div>

              <hr className="border-border my-2" />

              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">Bình luận</span>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {taskComments.length === 0 ? (
                    <p className="text-xs text-muted py-2">Chưa có bình luận nào cho task này.</p>
                  ) : (
                    taskComments.map((comment) => (
                      <div key={comment._id} className="rounded-xl border border-border bg-bg p-3 relative group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-ink">
                            {comment.author?.name || comment.author?.email || "User"}
                          </span>
                          <span className="text-[10px] text-muted font-mono">
                            {new Date(comment.createdAt).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted whitespace-pre-wrap pr-6">{comment.content}</p>
                        {(comment.author?._id === user?.id || comment.author === user?.id) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="absolute right-3 top-3 text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Xóa bình luận"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    required
                  />
                  <Button type="submit">
                    <PaperPlaneRight size={16} weight="bold" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
}

export default ProjectDetail;