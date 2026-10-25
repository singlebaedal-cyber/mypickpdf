const os = require('os');
os.hostname = () => 'MEDICORE';

for (const [key, val] of Object.entries(process.env)) {
    if (val && typeof val === 'string') {
        let isClean = true;
        for (let i = 0; i < val.length; i++) {
            if (val.charCodeAt(i) > 255) {
                isClean = false;
                break;
            }
        }
        if (!isClean) {
            process.env[key] = val.replace(/[^\x00-\x7F]/g, '');
        }
    }
}
process.env.COMPUTERNAME = 'MEDICORE';
process.env.LOGONSERVER = 'MEDICORE';
process.env.USERDOMAIN = 'MEDICORE';
process.env.USERDOMAIN_ROAMINGPROFILE = 'MEDICORE';
