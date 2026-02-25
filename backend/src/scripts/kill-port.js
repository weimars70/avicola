#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');

const portArg = process.argv[2];
const port = Number(portArg) || 3012;

function log(msg) {
  console.log(`[kill-port] ${msg}`);
}

if (!Number.isInteger(port)) {
  log('Puerto inválido');
  process.exit(0);
}

try {
  if (os.platform() === 'win32') {
    log(`Intentando liberar el puerto ${port} en Windows...`);
    // Obtener PIDs usando netstat
    let stdout;
    try {
      stdout = execSync(`netstat -ano | findstr :${port}`, { shell: 'cmd.exe', encoding: 'utf8' });
    } catch (e) {
      log(`No hay procesos activos en el puerto ${port}.`);
      process.exit(0);
    }

    const lines = stdout.split(/\r?\n/).filter(Boolean);
    const pids = new Set();
    for (const line of lines) {
      if (!line.includes(`:${port}`)) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
    }

    if (pids.size === 0) {
      log(`No hay procesos reales usando el puerto ${port}.`);
    } else {
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { shell: 'cmd.exe' });
          log(`Terminado PID ${pid}.`);
        } catch (e) {
          log(`No se pudo terminar PID ${pid} (tal vez ya se cerró).`);
        }
      }
      // Pequeña espera para que el SO libere el puerto
      log('Esperando 500ms para que el SO libere el puerto...');
      execSync('timeout /t 1 /nobreak', { shell: 'cmd.exe', stdio: 'ignore' });
    }
  } else {
    // Unix/Mac: lsof y kill -9
    log(`Intentando liberar el puerto ${port} en Unix...`);
    try {
      const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
      for (const pid of pids) {
        execSync(`kill -9 ${pid}`);
        log(`Terminado PID ${pid}.`);
      }
    } catch (e) {
      log(`No hay procesos activos en el puerto ${port}.`);
    }
  }
} catch (error) {
  log('Error al intentar liberar el puerto. Continuando de todas formas.');
}

process.exit(0);