const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

    lines.forEach((line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }

        const separatorIndex = trimmedLine.indexOf('=');

        if (separatorIndex === -1) {
            return;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

        if (key && process.env[key] === undefined) {
            process.env[key] = value;
        }
    });
}
