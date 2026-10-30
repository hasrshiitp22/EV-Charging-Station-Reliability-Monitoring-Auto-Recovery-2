import { startStationSimulator } from "./services/stationSimulator.js";
import { startRecoveryWorker } from "./services/recoveryWorker.js";
import app from "./app.js";

if (process.env.NODE_ENV !== "production") {
    app.listen(5000, "0.0.0.0", () => {
        console.log("Server running on localhost:5000");
        startStationSimulator();
        startRecoveryWorker();
    });
}


