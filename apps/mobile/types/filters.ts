export type YearFilter = "Upcoming" | number;
export type EventCategory = "beach" | "volleyball";
export type GenderFilter = "all" | string;
export type OrganizerTypeFilter = "all" | string;
export type CountryTypeFilter = "all" | string;
export type ApiEvent = {
    season?: number;
    countrycode?: string;
    name: string;
    gender?: string;
    startdate?: string;
    enddate?: string;
    orangizertype?: string;
    type?: string;
    website?: string;
};