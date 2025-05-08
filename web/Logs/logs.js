const fs = require('fs');
const path = require('path');

class Logger {
    constructor(logFilePath) {
        this.logFilePath = logFilePath || path.join(__dirname, 'app.log');
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] INFO: ${message}\n`;
        this.writeLog(logMessage);
    }

    error(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ERROR: ${message}\n`;
        this.writeLog(logMessage);
    }

    writeLog(logMessage) {
        fs.appendFile(this.logFilePath, logMessage, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });
    }
}

module.exports = Logger;

