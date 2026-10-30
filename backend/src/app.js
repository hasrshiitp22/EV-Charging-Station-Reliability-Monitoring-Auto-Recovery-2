
import express from "express";
import cors from "cors";

import stationRoutes from "./routes/stationRoute.js";
import incidentsRoutes from "./routes/incidentRoutes.js";

const app = express();

const allowedOrigins = [
    "https://frontend-zeta-five-39.vercel.app",
    "https://ev-charging-station-frontend.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/stations", stationRoutes);
app.use("/api/incidents", incidentsRoutes);

export default app;
