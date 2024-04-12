export default function getHourMinuteFromISOString(ISOString: string) {
    const date = new Date(ISOString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
}
