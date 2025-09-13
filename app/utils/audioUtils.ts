const TRASH_WORDS = [
    "official", "video", "lyrics", "audio", "remix", "slowed", "reverb",
    "ncs", "free", "download", "copyright", "music", "hq", "hd",
    "tik tok", "tiktok", "insta version", "prod.", "128 kbps"
];
function cleanFilename(filename: string): string {
    return filename
        .replace(/\.[^/.]+$/, "")                        // видаляємо розширення
        .replace(/https?:\/\/\S+|www\.\S+/gi, "")       // видаляємо URL
        .replace(/^[a-z0-9.-]+\.(com|net|org|co\.[a-z]{2,3}|io|ru)\s*-\s*/i, "") // видаляємо домен
        .replace(/^\d+[\s.-]*/, "")                     // видаляємо цифри на початку
        .replace(/[_]+/g, " ")                          // _ → пробіли
        .replace(/&amp;/g, "&")                         // HTML ентиті
        .replace(/\s*\(.*?\)/g, "")                     // видаляємо дужки //
        .replace(/ {2,}/g, " ")                         // зайві пробіли
        .trim();
}

export function formatTitle(filename: string) {
    if (!filename) return "Unknown Title";
    const cleaned = cleanFilename(filename);
    const parts = cleaned.split(" - ");
    if (parts.length === 2) return parts[1].trim(); // Artist - Title
    return cleaned;
}

export function formatArtist(filename: string) {
    if (!filename) return "Unknown Artist";
    const cleaned = cleanFilename(filename);
    const parts = cleaned.split(" - ");
    if (parts.length === 2) return parts[0].trim();
    return "Unknown Artist";
}

export function formatTime(s: number) {
    const minutes = Math.floor(s / 60)
    const seconds = Math.floor(s % 60)
    const time = `${minutes}:${seconds.toString().padStart(2, '0')}`
    return time
}
export function formatMilliseconds(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
