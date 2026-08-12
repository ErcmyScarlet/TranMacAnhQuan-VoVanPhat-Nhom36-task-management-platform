import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderSimple } from "@phosphor-icons/react";
import { getProjects, createProject, deleteProject } from "../api/projectApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import FormField from "../components/common/FormField";
import Input from "../components/common/Input";
import EmptyState from "../components/common/EmptyState";
import Skeleton from "../components/common/Skeleton";

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadProjects = () => {
    setLoading(true);
    getProjects()
      .then((res) => setProjects(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
  e.preventDefault();
  await createProject({ title, dueDate });
  setTitle("");
  setDueDate("");
  setOpen(false);
  loadProjects();
};

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Project của bạn</h1>
          <p className="text-muted text-sm mt-1">Quản lý tất cả project đang thực hiện</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} weight="bold" />
          Tạo project
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <EmptyState
            title="Chưa có project nào"
            description="Tạo project đầu tiên để bắt đầu phân công công việc cho nhóm."
            action={<Button onClick={() => setOpen(true)}>Tạo project</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Card
            key={p._id}
            onClick={() => navigate(`/projects/${p._id}`)}
            className="hover:border-accent/40 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
                <FolderSimple size={20} className="text-accent" />
              </div>
              <div className="font-display font-semibold mb-1">{p.title}</div>
              <p className="text-sm text-muted line-clamp-2 mb-4">{p.description || "Chưa có mô tả"}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted font-mono">
                  {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(p._id).then(loadProjects);
                  }}
                  className="text-xs text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity"
                >
                  Xóa
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo project mới">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <FormField label="Tên project" id="project-title">
            <Input
            id="project-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Website bán hàng"
            required
            />
          </FormField>
          <FormField label="Hạn chót" id="project-duedate">
            <Input
            id="project-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            />
          </FormField>
          <Button type="submit">Tạo project</Button>
        </form>
      </Modal>
</div>
  );
}

export default ProjectList;