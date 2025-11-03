import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskItem from './TaskItem.jsx'

function SortableTaskItem({
  task,
  depth = 0,
  hasChildren = false,
  canIndent = false,
  canOutdent = false,
  isDragEnabled = true,
  onToggleComplete,
  onEdit,
  onDelete,
  onSchedule,
  onPriorityChange,
  onAddComment,
  onDuplicate,
  onAddSubtask,
  onIndent,
  onOutdent,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !isDragEnabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem
        task={task}
        depth={depth}
        hasChildren={hasChildren}
        canIndent={canIndent}
        canOutdent={canOutdent}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        onSchedule={onSchedule}
        onPriorityChange={onPriorityChange}
        onAddComment={onAddComment}
        onDuplicate={onDuplicate}
        onAddSubtask={onAddSubtask}
        onIndent={onIndent}
        onOutdent={onOutdent}
        dragHandleProps={isDragEnabled ? { ...attributes, ...listeners } : null}
        isDragging={isDragging}
        isDragEnabled={isDragEnabled}
      />
    </div>
  )
}

export default memo(SortableTaskItem)
