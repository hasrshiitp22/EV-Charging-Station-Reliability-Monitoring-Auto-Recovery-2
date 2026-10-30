
import express from "express";
import { stations, STATUSES } from "../data/store.js";
import db from "../database/db.js";

const router = express.Router();

// GET /api/incidents
router.get("/", async (req, res) => {
    try {
        res.set("Cache-Control", "no-store");

        const result = await db.query(
            "SELECT * FROM incidents ORDER BY id DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Fetch incidents error:", error);
        res.status(500).json({ error: "Failed to fetch incidents" });
    }
});

// GET /api/incidents/status
router.get("/status", async (req, res) => {
    try {
        res.set("Cache-Control", "no-store");

        const result = await db.query(
            "SELECT result, COUNT(*)::int AS count FROM incidents GROUP BY result"
        );

        const incidentCounts = Object.fromEntries(
            result.rows.map(row => [row.result, row.count])
        );

        const counts = Object.fromEntries(
            STATUSES.map(status => [status, 0])
        );

        for (const station of stations) {
            if (counts[station.status] !== undefined) {
                counts[station.status]++;
            }
        }

        const recoveredCount = incidentCounts.RECOVERED || 0;
        const failedCount = incidentCounts.NEEDS_TECHNICIAN || 0;
        const pendingCount = incidentCounts.PENDING || 0;

        const completed = recoveredCount + failedCount;

        const recoverySuccessRate = completed
            ? Number(((recoveredCount / completed) * 100).toFixed(1))
            : 0;

        const recoveryTime = await db.query(`
            SELECT AVG("recoverySeconds") AS average
            FROM incidents
            WHERE result = 'RECOVERED'
        `);

        res.json({
            totalStations: stations.length,
            statusCounts: counts,
            totalIncidents: result.rows.reduce(
                (sum, row) => sum + row.count, 0
            ),
            recoveredIncidents: recoveredCount,
            failedIncidents: failedCount,
            pendingIncidents: pendingCount,
            recoverySuccessRate,
            averageRecoverySeconds:
                recoveryTime.rows[0].average === null
                    ? null
                    : Number(recoveryTime.rows[0].average)
        });

    } catch (error) {
        console.error("Incident status error:", error);
        res.status(500).json({ error: "Failed to fetch incident status" });
    }
});

export default router;
