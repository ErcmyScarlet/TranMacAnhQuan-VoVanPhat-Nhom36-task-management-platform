import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const columns = { todo: "To Do", doing: "Doing", done: "Done" };

function KanbanBoard({ tasks, onStatusChange }) {
  const grouped = { todo: [], doing: [], done: [] };
  tasks.forEach((t) => grouped[t.status].push(t));

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    onStatusChange(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "1rem" }}>
        {Object.entries(columns).map(([key, label]) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1, background: "#f4f4f4", padding: 8, minHeight: 300 }}>
                <h3>{label}</h3>
                {grouped[key].map((task, index) => (
                  <Draggable draggableId={task._id} index={index} key={task._id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ padding: 8, marginBottom: 8, background: "white", borderRadius: 4, ...provided.draggableProps.style }}
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;