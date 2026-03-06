import type { InterviewSchedule } from "../../../../utils/types/jobs/IInterviewSchedule.js";
import { GoogleCalendar } from "./setup.js";

export const setUpInterview = async ({
  candidateEmail,
  candidateName,
  description,
  endDateTime,
  isRemote,
  location,
  startDateTime,
  summary,
  timeZone,
  interviewers,
}: InterviewSchedule) => {
  const calendarInstance = new GoogleCalendar();
  const calendar = calendarInstance.getCalendar()!;

  const event: any = {
    summary,
    description,
    location,
    start: { dateTime: startDateTime, timeZone },
    end: { dateTime: endDateTime, timeZone },
    attendees: [
      { email: candidateEmail, displayName: candidateName },
      ...interviewers.map((email) => {
        return { email: email };
      }),
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };
  if (isRemote) {
    event.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    };
    event.location = "Google Meet";
  }

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1,
    sendUpdates: "all",
  });

  if (isRemote) {
    const meetLink = response.data.hangoutLink;
    return {
      isRemote,
      meetLink: meetLink!,
    };
  }
  return {
    isRemote,
    meetLink: location,
  };
};
