import requests
from lxml import etree
from datetime import datetime
from models.tournaments import Session, VolleyTournament

VOLLEY_URL = "https://www.fivb.org/Vis2009/XmlRequest.asmx?Request=%3CRequests%3E%3CRequest%20Type=%22GetVolleyTournamentList%22%20Fields=%22logos%20code%20City%20CountryCode%20StartDate%20EndDate%20EventLogos%20Gender%20Name%20OrganizerType%20Season%20ShortNameOrName%20Type%20WebSite%22%3E%3CFilter%20%20FirstDate=%221900-01-01%22%20Statuses=%221%202%203%204%205%22/%3E%3C/Request%3E%3C/Requests%3E"

GENDER_MAP = {
    '0': 'Male',
    '1': 'Female'
}

ORG_MAP = {
    "0": "Unknown",
    "1": "FIVB",
    "2": "Confederation",
    "3": "MultiSports",
    "4": "Other",
    "5": "National Federation"
}

T_MAP = {
    "0": "Grand slam",
    "1": "Open",
    "2": "Challenger",
    "3": "World series",
    "4": "World championship",
    "5": "Olympic games",
    "6": "Satellite",
    "7": "Continental championship",
    "8": "Other continental",
    "9": "Other",
    "10": "CEV Masters",
    "11": "Continental cup",
    "12": "Continental tour",
    "13": "Junior world championship",
    "14": "Youth world championship",
    "15": "National tour",
    "16": "National tour (under 23 years)",
    "17": "National tour (under 21 years)",
    "18": "National tour (under 19 years)",
    "19": "National tour (under 20 years)",
    "20": "National tour (under 17 years)",
    "21": "National tour (under 15 years)",
    "22": "Continental championship (under 22 years)",
    "23": "Continental championship (under 20 years)",
    "24": "Continental championship (under 18 years)",
    "25": "World championship (under 23 years)",
    "26": "World championship (under 21 years)",
    "27": "World championship (under 19 years)",
    "28": "National tour (under 14 years)",
    "29": "National tour (under 16 years)",
    "30": "National tour (under 18 years)",
    "31": "World championship (under 17 years)",
    "32": "Major Series",
    "33": "World Tour Finals",
    "34": "Zonal Tour",
    "35": "Test",
    "36": "Snow Volleyball",
    "37": "Continental Cup Final",
    "38": "World Tour 5*",
    "39": "World Tour 4*",
    "40": "World Tour 3*",
    "41": "World Tour 2*",
    "42": "World Tour 1*",
    "43": "Youth Olympic Games",
    "44": "Multiple sports",
    "45": "National snow volleyball",
    "46": "National Tour (under 22 years)",
    "47": "Continental championship (under 21 years)",
    "48": "Continental championship (under 19 years)",
    "49": "Qualification tournament for Olympic Games",
    "50": "King of the Court",
    "51": "Pro Tour Elite16",
    "52": "Pro Tour Challenge",
    "53": "Pro Tour Futures",
    "54": "Pro Tour Finals",
    "55": "World Championship Qualification"
}


def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None

def fetch_volley_tournaments():
    resp = requests.get(VOLLEY_URL)
    root = etree.fromstring(resp.content)
    tournaments = []
    for item in root.xpath("//VolleyballTournament"):
        tournaments.append({
            'code': item.get("Code"),
            'season': item.get("Season"),
            'country_code': item.get("CountryCode"),
            'name': item.get("Name"),
            'gender': GENDER_MAP.get(item.get("Gender")),
            'event_logos': item.get("EventLogos"),
            'start_date': parse_date(item.get("StartDate")),
            'end_date': parse_date(item.get("EndDate")),
            'organizer_type': ORG_MAP.get(item.get("OrganizerType")),
            'type': T_MAP.get(item.get("Type")),
            'website': item.get("WebSite"),
            'no': item.get("No"),
            'version': item.get("Version"),
        })
    return tournaments

def save_volley():
    tournaments = fetch_volley_tournaments()
    session = Session()
    try:
        for t in tournaments:
            obj = session.query(VolleyTournament).filter_by(code=t['code']).first()
            if not obj:
                obj = VolleyTournament(**t)
                session.add(obj)
            else:
                for k, v in t.items():
                    setattr(obj, k, v)
        session.commit()
        print(f"[Volley] Saved {len(tournaments)} tournaments")
    except Exception as e:
        print(f"[Volley] Error: {e}")
        session.rollback()
    finally:
        session.close()
