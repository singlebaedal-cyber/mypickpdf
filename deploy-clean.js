const { spawn } = require('child_process');
const path = require('path');

const patchScript = path.join(__dirname, 'patch-os.js').replace(/\\/g, '/');

const cleanEnv = { ...process.env };
cleanEnv.NODE_OPTIONS = `--require "${patchScript}"`;
cleanEnv.COMPUTERNAME = 'MEDICORE';
cleanEnv.LOGONSERVER = 'MEDICORE';
cleanEnv.USERDOMAIN = 'MEDICORE';
cleanEnv.USERDOMAIN_ROAMINGPROFILE = 'MEDICORE';

const args = process.argv.slice(2);
const vercelArgs = args.length > 0 ? args : ['--prod', '--yes'];

console.log("Running Vercel with patched NODE_OPTIONS...");
const child = spawn('npx', ['vercel', ...vercelArgs], {
    cwd: path.join(__dirname),
    env: cleanEnv,
    stdio: 'inherit',
    shell: true
});

child.on('close', (code) => {
    console.log(`Vercel process completed with code ${code}`);
    process.exit(code);
});
