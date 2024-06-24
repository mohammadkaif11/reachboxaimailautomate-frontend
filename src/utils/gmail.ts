import { gmail_v1, google } from "googleapis";

export const fetchGmailEmails = async (auth: any) => {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.list({ userId: "me", q: "is:unread" });
  return res.data.messages || [];
};
