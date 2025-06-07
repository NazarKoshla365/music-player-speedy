export function formatTitle(filename: string) {
    if (filename) {

        const cleaned = filename
            .replace(/_/g, ' ')
            .replace(/\.(mp3|wav|m4a)$/i, '')
            .replace(/\s*\(.*?\)/g, '')
            .replace(/\s*-\s*/g, ' - ')
            .replace(/ +/g, ' ')
            .trim();

        const parts = cleaned.split(' - ');
        if (parts.length === 2) return parts[1];
        return cleaned;
    }
    return "Unknown Title";
}
export function formatArtist(filename: string) {
    if (filename) {
        const cleaned = filename
            .replace(/_/g, ' ')
            .replace(/\.(mp3|wav|m4a)$/i, '')
            .replace(/\s*\(.*?\)/g, '')
            .replace(/\s*-\s*/g, ' - ')
            .replace(/ +/g, ' ')
            .trim();

        const parts = cleaned.split(' - ');
        if (parts.length === 2) return parts[0];
        return "Unknown Artist";
    }
    return "Unknown Artist";
}

export function calculateTime(s: number) {
    const minutes = Math.floor(s / 60)
    const seconds = Math.floor(s % 60)
    const time = `${minutes}:${seconds.toString().padStart(2, '0')}`
    return time
}
export function formatMilliseconds(ms:number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
