import { useState } from "react";
import { createTask } from "../api/taskApi";
import FormField from "./common/FormField";
import Input from "./common/Input";
import Select from "./common/Select";
import Button from "./common/Button";

function TaskForm({ projectId, onCreated }) {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "medium" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTask({ ...form, projectId });
    setForm({ title: "", description: "", dueDate: "", priority: "medium" });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Tiêu đề task" id="task-title">
        <Input
          id="task-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Ví dụ: Thiết kế trang đăng nhập"
          required
        />
      </FormField>
      <FormField label="Mô tả" id="task-desc">
        <Input
          id="task-desc"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Mô tả ngắn (tuỳ chọn)"
        />
      </FormField>
      <FormField label="Hạn chót" id="task-duedate">
        <Input
          id="task-duedate"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
      </FormField>
      <FormField label="Độ ưu tiên" id="task-priority">
        <Select
          id="task-priority"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Thấp</option>
          <option value="medium">Trung bình</option>
          <option value="high">Cao</option>
        </Select>
      </FormField>
      <Button type="submit">Thêm task</Button>
    </form>
  );
}

export default TaskForm;