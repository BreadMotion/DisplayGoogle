import { google, calendar_v3 } from "googleapis";
import { GoogleAuthService } from "./google-auth";

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
  private authService: GoogleAuthService;

  constructor(authService: GoogleAuthService) {
    this.authService = authService;
  }

  private get calendarClient(): calendar_v3.Calendar {
    return google.calendar({
      version: "v3",
      auth: this.authService.getClient(),
    });
  }

  async getCalendarList(): Promise<CalendarListItem[]> {
    try {
      const response =
        await this.calendarClient.calendarList.list();
      const items = response.data.items || [];
      console.log(
        "[main] GoogleCalendarService.getCalendarList ->",
        items.length,
        "items",
      );

      return items.map((item) => ({
        id: item.id || "",
        summary: item.summary || "",
        backgroundColor: item.backgroundColor ?? undefined,
        foregroundColor: item.foregroundColor ?? undefined,
      }));
    } catch (error) {
      console.error("カレンダー一覧の取得に失敗:", error);
      throw error;
    }
  }

  async getEvents(
    calendarId: string,
    timeMin: string,
    timeMax: string,
  ): Promise<CalendarEvent[]> {
    try {
      console.log(
        `[main] GoogleCalendarService.getEvents -> calendarId=${calendarId} timeMin=${timeMin} timeMax=${timeMax}`,
      );
      const response =
        await this.calendarClient.events.list({
          calendarId: calendarId,
          timeMin: timeMin,
          timeMax: timeMax,
          singleEvents: true,
          orderBy: "startTime",
        });

      const events = response.data.items || [];
      console.log(
        "[main] GoogleCalendarService.getEvents -> returned",
        events.length,
        "events",
      );

      return events.map((event) => ({
        id: event.id || "",
        summary: event.summary || "(タイトルなし)",
        start:
          event.start?.dateTime || event.start?.date || "",
        end: event.end?.dateTime || event.end?.date || "",
        description: event.description ?? undefined,
        location: event.location ?? undefined,
        htmlLink: event.htmlLink ?? undefined,
        colorId: event.colorId ?? undefined,
      }));
    } catch (error) {
      console.error("イベントの取得に失敗:", error);
      throw error;
    }
  }
}
