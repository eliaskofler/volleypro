export function formatShortDateRange(startISO?: string, endISO?: string) {
    const normalize = (v?: string) => {
        const s = String(v ?? "").trim();
        if (!s) return "";
        if (s.toLowerCase() === "null" || s.toLowerCase() === "none") return "";
        if (s === "0000-00-00") return "";
        return s;
    };

    const startStr = normalize(startISO);
    const endStr = normalize(endISO);

    if (!startStr) return "TBA";

    const parseISODate = (s: string) => {
        // Expecting YYYY-MM-DD (your API now returns this)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
        const d = new Date(`${s}T00:00:00`);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const start = parseISODate(startStr);
    if (!start) return "TBA";

    const end = endStr ? parseISODate(endStr) : null;

    const monthDay = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

    if (!end) return monthDay.format(start);

    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) return `${monthDay.format(start)}–${end.getDate()}`;
    return `${monthDay.format(start)}–${monthDay.format(end)}`;
}