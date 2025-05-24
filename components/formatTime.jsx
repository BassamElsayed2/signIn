export function formatTime(timestamp, locale ) {
    if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleTimeString(locale , {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
