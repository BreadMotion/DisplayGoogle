import { google, tasks_v1 } from 'googleapis';
import { GoogleAuthService } from './google-auth';

export interface TaskList {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: string;
  due?: string;
  completed?: string;
  parent?: string;
  links?: Array<{ type: string; link: string }>;
}

export class GoogleTasksService {
  private tasks: tasks_v1.Tasks;

  constructor(private authService: GoogleAuthService) {
    this.tasks = google.tasks({ version: 'v1', auth: authService.getClient() });
  }

  async getTaskLists(): Promise<TaskList[]> {
    try {
      const response = await this.tasks.tasklists.list();
      const items = response.data.items || [];

      return items.map((item) => ({
        id: item.id || '',
        title: item.title || '',
      }));
    } catch (error) {
      console.error('タスクリストの取得に失敗:', error);
      throw error;
    }
  }

  async getTasks(taskListId: string): Promise<Task[]> {
    try {
      const response = await this.tasks.tasks.list({
        tasklist: taskListId,
        showCompleted: true,
        showHidden: false,
      });

      const items = response.data.items || [];

      return items.map((item) => ({
        id: item.id || '',
        title: item.title || '(タイトルなし)',
        notes: item.notes,
        status: item.status || 'needsAction',
        due: item.due,
        completed: item.completed,
        parent: item.parent,
        links: item.links as Array<{ type: string; link: string }> | undefined,
      }));
    } catch (error) {
      console.error('タスクの取得に失敗:', error);
      throw error;
    }
  }
}
