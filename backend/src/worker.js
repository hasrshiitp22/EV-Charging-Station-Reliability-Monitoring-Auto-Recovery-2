import "dotenv/config";

import { startStationSimulator } from "./services/stationSimulator.js";
import { startRecoveryWorker } from "./services/recoveryWorker.js";

console.log("EV Charging Station Worker Started");

startStationSimulator();
startRecoveryWorker();
