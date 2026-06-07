import React, { useMemo } from 'react';
import { Task } from '../types';
import '../styles/TasksView.css';

interface TasksViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, onTaskClick }) => {
  const { incompleteTasks, completedTasks } = useMemo(() => {
    const incomplete: Task[] = [];
    const completed: Task[] = [];

    tasks.forEach((task) => {
      if (task.status === 'completed') {
        completed.push(task);
      } else {
        incomplete.push(task);
      }
    });

    return { incompleteTasks: incomplete, completedTasks: completed };
  }, [tasks]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (task: Task): boolean => {
    if (!task.due || task.status === 'completed') return false;
    const dueDate = new Date(task.due);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const renderTask = (task: Task) => {
    const overdue = isOverdue(task);

    return (
      <div
        key={task.id}
        className={`task-item ${task.status === 'completed' ? 'completed' : ''} ${
          overdue ? 'overdue' : ''
        }`}
        onClick={() => onTaskClick(task)}
      >
        <div className="task-checkbox">
          {task.status === 'completed' ? '✓' : '○'}
        </div>
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.notes && <div className="task-notes">{task.notes}</div>}
          <div className="task-meta">
            {task.due && (
              <span className="task-due">
                📅 {formatDate(task.due)}
              </span>
            )}
            {task.completed && (
              <span className="task-completed">
                ✓ {formatDate(task.completed)}
              </span>
            )}
          </div>
          {task.links && task.links.length > 0 && (
            <div className="task-links">
              {task.links.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  className="task-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.electronAPI.openBrowser(link.link);
                  }}
                  title={link.type}
                >
                  🔗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tasks-view">
      {incompleteTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">
            未完了のタスク ({incompleteTasks.length})
          </h3>
          <div className="task-list">
            {incompleteTasks.map((task) => renderTask(task))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="task-section">
          <h3 className="section-title">
            完了したタスク ({completedTasks.length})
          </h3>
          <div className="task-list">
            {completedTasks.map((task) => renderTask(task))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="empty-state">
          <p>タスクがありません</p>
        </div>
      )}
    </div>
  );
};

export default TasksView;
