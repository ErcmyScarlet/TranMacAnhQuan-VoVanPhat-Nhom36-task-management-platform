import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Badge from "./common/Badge";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];

function KanbanBoard({ tasks = [], onStatusChange, onTaskClick }) {
  const grouped = { todo: [], doing: [], done: [] };
  (tasks || []).forEach((t) => {
    if (grouped[t.status]) {
      grouped[t.status].push(t);
    } else {
      grouped.todo.push(t);
    }
  });

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map(({ key, label }) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="bg-bg rounded-2xl p-4 min-h-[400px]">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm font-semibold text-ink">{label}</span>
                  <span className="text-xs font-mono text-muted">{grouped[key].length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {grouped[key].map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onTaskClick?.(task)}
                          className={`bg-surface border border-border rounded-xl p-4 shadow-soft transition-all cursor-pointer hover:border-accent/40 ${
                            snapshot.isDragging ? "rotate-1 scale-[1.02]" : ""
                          }`}
                        >
                          <p className="text-sm font-medium text-ink mb-2">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge tone={task.priority}>{task.priority}</Badge>
                              {task.dueDate && (
                                <span className="text-xs font-mono text-muted">
                                  {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted font-medium bg-bg px-2 py-0.5 rounded-full border border-border">
                              {task.assigneeId?.name || "Chưa giao"}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;