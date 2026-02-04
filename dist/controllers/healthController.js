"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = healthCheck;
const db_1 = require("../db");
async function healthCheck(req, res) {
    try {
        await db_1.pool.query("SELECT 1");
        res.status(200).json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            database: "disconnected",
            timestamp: new Date().toISOString(),
        });
    }
}
