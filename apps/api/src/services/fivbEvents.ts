import { asArray, xmlParser } from '../utils/xml.js';

export type Discipline = 'volleyball' | 'beach-volleyball';

type FivbTournament = {
    City?: string;
    CountryCode?: string;

    // Volley
    StartDate?: string;
    EndDate?: string;

    // Beach (varies by endpoint/fields)
    startDate?: string;
    StartDateMainDraw?: string;
    EndDateMainDraw?: string;
    StartDateQualification?: string;
    EndDateQualification?: string;

    Gender?: string | number;
    Name?: string;
    OrganizerType?: string | number;
    ShortNameOrName?: string;
};

type UpstreamSpec = {
    requestType: string;
    fields: string;
    statuses: string; // space-separated VIS status codes
    getItemsNode: (parsed: any) => unknown;
};

function pickFirstString(...values: Array<unknown>): string {
    for (const v of values) {
        const s = String(v ?? '').trim();
        if (s) return s;
    }
    return '';
}

function sliceDate10(value: unknown): string {
    const s = String(value ?? '').trim();
    return s ? s.slice(0, 10) : '';
}

// Tries common VIS response shapes. Keeps the “discipline config” simple while being robust.
function findTournamentsNode(parsed: any, candidates: string[]): unknown {
    for (const path of candidates) {
        const parts = path.split('.');
        let cur: any = parsed;
        for (const p of parts) cur = cur?.[p];
        if (cur) return cur;
    }
    return undefined;
}

const SPECS: Record<Discipline, UpstreamSpec> = {
    volleyball: {
        requestType: 'GetVolleyTournamentList',
        fields:
            'logos code City CountryCode StartDate EndDate EventLogos Gender Name OrganizerType Season ShortNameOrName Type WebSite',
        statuses: '1 2 3 4 5',
        getItemsNode: (parsed) =>
            findTournamentsNode(parsed, [
                'Responses.VolleyballTournaments.VolleyballTournament',
                'Responses.VolleyTournaments.VolleyTournament',
            ]),
    },

    'beach-volleyball': {
        requestType: 'GetBeachTournamentList',
        // Matches your example URL exactly
        fields:
            'Season code EndDateMainDraw StartDateMainDraw EndDateQualification StartDateQualification startDate Name CountryCode City Gender Type OrganizerType WebSite EventLogos',
        // Matches your example URL exactly
        statuses: '0 1 6 7 8 9',
        getItemsNode: (parsed) =>
            findTournamentsNode(parsed, [
                'Responses.BeachVolleyballTournaments.BeachVolleyballTournament',
                'Responses.BeachTournaments.BeachTournament',
            ]),
    },
};

function genderLabel(gender: unknown): 'Men' | 'Women' | 'Mixed' {
    const n = Number(gender);
    if (n === 0) return 'Men';
    if (n === 1) return 'Women';
    return 'Mixed';
}

function organizerLabel(organizerType: unknown): string {
    const n = Number(organizerType);
    if (n === 2) return 'Confederation';
    if (n === 5) return 'National Federation';
    return 'Other';
}

function countryNameFromCode(countryCode: unknown): string {
    const code = String(countryCode ?? '').trim().toUpperCase();
    if (!code) return '';
    try {
        const dn = new Intl.DisplayNames(['en'], { type: 'region' });
        return dn.of(code) ?? '';
    } catch {
        return '';
    }
}

function buildFivbUrl(discipline: Discipline, firstDate: string): string {
    const spec = SPECS[discipline];

    const xmlRequest =
        `<Requests>` +
        `<Request Type="${spec.requestType}" Fields="${spec.fields}">` +
        `<Filter FirstDate="${firstDate}" Statuses="${spec.statuses}"/>` +
        `</Request>` +
        `</Requests>`;

    const encoded = encodeURIComponent(xmlRequest);
    return `https://www.fivb.org/Vis2009/XmlRequest.asmx?Request=${encoded}`;
}

export function parseFirstDate(input: unknown): string {
  const s = String(input ?? '');
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '2026-01-01';
}

export function parseYear(input: unknown): number | null {
  const s = String(input ?? '').trim();
  if (!/^\d{4}$/.test(s)) return null;

  const year = Number(s);
  if (year < 2000 || year > 2100) return null;

  return year;
}

export function firstDateFromYear(year: number): string {
  return `${year}-01-01`;
}

function eventDatesForDiscipline(discipline: Discipline, t: FivbTournament): { start_date: string; end_date: string } {
    if (discipline === 'beach-volleyball') {
        const start = pickFirstString(t.StartDateMainDraw, t.StartDateQualification, t.startDate, t.StartDate);
        const end = pickFirstString(t.EndDateMainDraw, t.EndDateQualification, t.EndDate);
        return { start_date: sliceDate10(start), end_date: sliceDate10(end) };
    }

    return { start_date: sliceDate10(t.StartDate), end_date: sliceDate10(t.EndDate) };
}

export async function fetchEvents(params: {
    discipline: Discipline;
    firstDate: string;
}): Promise<{ events: any[] }> {
    const { discipline, firstDate } = params;

    const url = buildFivbUrl(discipline, firstDate);

    const res = await fetch(url, {
        headers: {
            Accept: 'text/xml, application/xml;q=0.9, */*;q=0.1',
        },
    });

    if (!res.ok) {
        const error = `Upstream request failed with ${res.status} ${res.statusText}`;
        const err = new Error(error);
        (err as any).statusCode = 502;
        throw err;
    }

    const xml = await res.text();
    const parsed = xmlParser.parse(xml);

    const itemsNode = SPECS[discipline].getItemsNode(parsed);
    const tournaments = asArray<FivbTournament>(itemsNode as any);

    const events = tournaments.map((t) => {
        const country_code = String(t.CountryCode ?? '').trim().toUpperCase();
        const city = String(t.City ?? '').trim();
        const name = String(t.ShortNameOrName ?? t.Name ?? '').trim();
        const { start_date, end_date } = eventDatesForDiscipline(discipline, t);

        return {
            start_date,
            end_date,
            organizer: organizerLabel(t.OrganizerType),
            name,
            type: `${discipline} / ${genderLabel(t.Gender)}`,
            country_code,
            city,
            country: countryNameFromCode(country_code),
        };
    });

    return { events };
}