import type { FastifyPluginAsync } from "fastify";
import { db } from "../services/db.js";

type Sport = "beach" | "volleyball";
const ALLOWED_SPORTS: Sport[] = ["beach", "volleyball"];

function tableForSport(sport: Sport) {
    return sport === "beach" ? "beach_tournaments" : "volley_tournaments";
}

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    app.get("/events", async (request, reply) => {
        const { sport, year } = (request.query as { sport?: string; year?: string }) ?? {};

        if (!sport || !ALLOWED_SPORTS.includes(sport as Sport)) {
            return reply.code(400).send({
                ok: false,
                error: `Invalid sport. Use one of: ${ALLOWED_SPORTS.join(", ")}`,
            });
        }

        const table = tableForSport(sport as Sport);
        const yearValue = String(year ?? "upcoming").trim();

        let sql = `
            SELECT
                season,
                country_code,
                name,
                gender,
                to_char(start_date, 'YYYY-MM-DD') AS start_date,
                to_char(end_date, 'YYYY-MM-DD') AS end_date,
                organizer_type,
                type,
                website
            FROM ${table}
            WHERE 1=1
        `;

        const values: Array<string | number> = [];

        if (yearValue.toLowerCase() === "upcoming") {
            sql += ` AND start_date >= CURRENT_DATE`;
        } else {
            const y = Number(yearValue);
            if (!Number.isInteger(y) || y < 2000 || y > 2100) {
                return reply.code(400).send({ ok: false, error: "Invalid year. Use 'upcoming' or YYYY." });
            }

            // Filter by start_date falling in the requested year
            sql += ` AND start_date >= $1 AND start_date < $2`;
            values.push(`${y}-01-01`, `${y + 1}-01-01`);
        }

        sql += ` ORDER BY start_date ASC`;

        try {
            const result = await db.query(sql, values);

            return reply.send(
                result.rows.map((r) => ({
                    season: r.season ? Number(r.season) || undefined : undefined,
                    countrycode: r.country_code ?? "",
                    name: r.name ?? "",
                    gender: r.gender ?? "",
                    startdate: r.start_date ?? "",
                    enddate: r.end_date ?? "",
                    orangizertype: r.organizer_type ?? "",
                    type: r.type ?? "",
                    website: r.website ?? "",
                }))
            );
        } catch (err) {
            app.log.error(err);
            return reply.code(500).send({ ok: false, error: "Failed to query events" });
        }
    });
};
