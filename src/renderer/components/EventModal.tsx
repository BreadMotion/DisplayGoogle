import React from 'react';
import { CalendarEvent, Task } from '../types';

interface EventModalProps {
  event?: CalendarEvent;
  task?: Task;
  onClose: () => void;
  onOpenInBrowser: (url: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  task,
  onClose,
  onOpenInBrowser,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleOpenInBrowser = () => {
    if (event?.htmlLink) {
      onOpenInBrowser(event.htmlLink);
    } else if (task?.links && task.links.length > 0) {
      const webLink = task.links.find((link) => link.type === 'email');
      if (webLink) {
        onOpenInBrowser(webLink.link);
      }
    }
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* イベント表示 */}
        {event && (
          <div className="event-details">
            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                color: '#202124',
                fontWeight: 'bold',
              }}
            >
              {event.summary}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  color: '#5f6368',
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '18px' }}>🕐</span>
                <div>
                  <div>{formatDateTime(event.start)}</div>
                  <div style={{ fontSize: '14px' }}>～ {formatDateTime(event.end)}</div>
                </div>
              </div>

              {event.location && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    color: '#5f6368',
                  }}
                >
                  <span style={{ marginRight: '8px', fontSize: '18px' }}>📍</span>
                  <span>{event.location}</span>
                </div>
              )}

              {event.description && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    color: '#202124',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>説明:</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{event.description}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              {event.htmlLink && (
                <button
                  onClick={handleOpenInBrowser}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  🌐 ブラウザで開く
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f3f4',
                  color: '#202124',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* タスク表示 */}
        {task && (
          <div className="task-details">
            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: '24px',
                color: '#202124',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {task.status === 'completed' ? '✅' : '⬜'}
              {task.title}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  color: '#5f6368',
                }}
              >
                <span style={{ marginRight: '8px', fontSize: '18px' }}>📊</span>
                <span>
                  ステータス:{' '}
                  {task.status === 'completed' ? '完了' : task.status === 'needsAction' ? '未完了' : task.status}
                </span>
              </div>

              {task.due && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    color: '#5f6368',
                  }}
                >
                  <span style={{ marginRight: '8px', fontSize: '18px' }}>📅</span>
                  <span>期限: {formatDate(task.due)}</span>
                </div>
              )}

              {task.completed && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px',
                    color: '#5f6368',
                  }}
                >
                  <span style={{ marginRight: '8px', fontSize: '18px' }}>✅</span>
                  <span>完了日時: {formatDate(task.completed)}</span>
                </div>
              )}

              {task.notes && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    color: '#202124',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>メモ:</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{task.notes}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
              {task.links && task.links.length > 0 && (
                <button
                  onClick={handleOpenInBrowser}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4285f4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  🌐 ブラウザで開く
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f1f3f4',
                  color: '#202124',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
