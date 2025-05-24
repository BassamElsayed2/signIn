import messagesAr from "@/messages/ar.json";
import messagesEn from "@/messages/en.json";

export function getMessages(locale) {
  switch (locale) {
    case "ar":
      return messagesAr;
    case "en":
      return messagesEn;
    default:
      return messagesEn;
  }
}
