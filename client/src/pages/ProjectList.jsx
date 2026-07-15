import { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "../api/projectApi";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");

  const loadProjects = () => {
    getProjects().then((res) => setProjects(res.data.data));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProject({ title });
    setTitle("");
    loadProjects();
  };

  const handleDelete = async (id) => {
    await deleteProject(id);
    loadProjects();
  };

  return (
    <div>
      <h1>Danh sách Project</h1>
      <form onSubmit={handleCreate}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên project" required />
        <button type="submit">Tạo project</button>
      </form>
      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            {p.title} <button onClick={() => handleDelete(p._id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;