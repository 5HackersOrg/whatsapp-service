import serviceAccount from "../../../../../cloud_keys/nth-highlander-482810-m2-92b4a9237d00.json" with { type: "json" };
import { calendar_v3, google } from "googleapis";

export class GoogleCalendar {
  clientEmail = serviceAccount.client_email;
  private_key = serviceAccount.private_key;
  calendar: calendar_v3.Calendar | null = null;
  static instance: GoogleCalendar | null = null;
  constructor() {
    if (GoogleCalendar.instance) {
      return GoogleCalendar.instance;
    }
    try {
      const auth = new google.auth.JWT({
        email: this.clientEmail,
        key: this.private_key,
        scopes: [
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/calendar.events",
        ],
        subject:"interviews@whatshire.co.za"
      });

      this.calendar = google.calendar({ version: "v3", auth });
      console.log("initialized calendar");
      GoogleCalendar.instance = this;
    } catch (err) {
      console.log("error occured : ", err);
    }
  }
  getCalendar() {
    return this.calendar;
  }
}
