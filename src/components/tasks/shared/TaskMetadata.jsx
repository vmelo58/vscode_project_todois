import { memo } from 'react'
import { PRIORITIES } from '../../../constants/priorities.js'
import { PROJECTS } from '../../../constants/projects.js'
import { formatDateLabel } from '../../../utils/date.js'
import './TaskMetadata.css'

function TaskMetadata({ task, compact = false }) {
  const priorityInfo = task.priority ? PRIORITIES[task.priority] : null
  const projectInfo = task.projectId ? PROJECTS[task.projectId] : null
  const hasLabels = task.labels && task.labels.length > 0

  if (compact) {
    return (
      <div className="task-metadata-compact">
        {priorityInfo && (
          <span className="task-priority" title={priorityInfo.label}>
            {priorityInfo.icon}
          </span>
        )}
        {task.dueDate && (
          <span className="task-date">{formatDateLabel(task.dueDate)}</span>
        )}
        {projectInfo && (
          <span className="task-project">
            <span className="task-project-icon">{projectInfo.icon}</span>
            <span className="task-project-name">{projectInfo.name}</span>
          </span>
        )}
        {hasLabels && task.labels.map((label, index) => (
          <span key={index} className="task-label-badge">
            {label}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="task-metadata">
      {priorityInfo && (
        <span className="task-priority" title={priorityInfo.label}>
          {priorityInfo.icon}
        </span>
      )}
      {task.dueDate && (
        <span className="task-date">{formatDateLabel(task.dueDate)}</span>
      )}
      {projectInfo && (
        <span className="task-project">
          <span className="task-project-icon">{projectInfo.icon}</span>
          <span className="task-project-name">{projectInfo.name}</span>
        </span>
      )}
      {hasLabels && task.labels.map((label, index) => (
        <span key={index} className="task-label-badge">
          {label}
        </span>
      ))}
    </div>
  )
}

export default memo(TaskMetadata)
