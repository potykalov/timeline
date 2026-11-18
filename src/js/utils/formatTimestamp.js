export default function getTimestamp() {
  const date = new Date();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    hour12: false,
    timeZone: "Europe/Moscow",
  };

  const foramatedTimestamp = new Intl.DateTimeFormat("ru-ru", options)
    .format(date)
    .replace(",", "");

  return foramatedTimestamp;
}
