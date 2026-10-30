import { startStationSimulator } from "./services/stationSimulator.js";
import { startRecoveryWorker } from "./services/recoveryWorker.js";
import app from "./app.js";

export default function handler(req, res) {
    return app(req, res);
}


if (process.env.NODE_ENV !== "production") {
    app.listen(5000, "0.0.0.0", () => {
        console.log("Server running on http://localhost:5000");

        startStationSimulator();
        startRecoveryWorker();
    });
}
