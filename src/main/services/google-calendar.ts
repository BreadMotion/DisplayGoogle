import { google, calendar_v3 } from 'googleapis';
import { GoogleAuthService } from './google-auth';

export interface CalendarListItem {
  id: string;
  summary: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  colorId?: string;
}

export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor(private authService: GoogleAuthService) {
    this.calendar = google.calendar({ version: 'v3', auth: authService.getClient() });
  }

  async getCalendarList(): Promise<CalendarListItem[]> {
    try {
      const response = await this.calendar.calendarList.list();
      const items = response.data.items || [];

      return items.map((item) => ({
        id: item.id || '',
        summary: item.summary || '',
        backgroundColor: item.backgroundColor,
        foregroundColor: item.foregroundColor,
      }));
    } catch (error) {
      console.error('カレンダー一覧の取得に失敗:', error);
      throw error;
    }
  }

  async getEvents(
    calendarId: string,
    timeMin: string,
    timeMax: string
  ): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      return events.map((event) => ({
        id: event.id || '',
        summary: event.summary || '(タイトルなし)',
        start: event.start?.dateTime || event.start?.date || '',
        end: event.end?.dateTime || event.end?.date || '',
        description: event.description,
        location: event.location,
        htmlLink: event.htmlLink,
        colorId: event.colorId,
      }));
    } catch (error) {
      console.error('イベントの取得に失敗:', error);
      throw error;
    }
  }
}
