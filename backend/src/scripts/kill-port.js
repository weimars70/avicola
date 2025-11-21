#!/usr/bin/env node
const { exec } = require('child_process');
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

if (os.platform() === 'win32') {
  // Windows: usar netstat para hallar PIDs y taskkill para cerrarlos
  exec(`netstat -ano | findstr :${port}`, { shell: 'cmd.exe' }, (err, stdout, stderr) => {
    if (err) {
      log('No se pudo obtener procesos (netstat). Continuando.');
      return;
    }
    const lines = stdout.split(/\r?\n/).filter(Boolean);
    const pids = new Set();
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    if (pids.size === 0) {
      log(`No hay procesos usando el puerto ${port}.`);
      return;
    }
    for (const pid of pids) {
      exec(`taskkill /F /PID ${pid}`, { shell: 'cmd.exe' }, (e) => {
        if (e) log(`No se pudo terminar PID ${pid}.`);
        else log(`Terminado PID ${pid}.`);
      });
    }
  });
} else {
  // Unix/Mac: lsof y kill -9
  exec(`lsof -ti:${port}`, (err, stdout) => {
    if (err) {
      log('lsof no disponible o sin procesos. Continuando.');
      return;
    }
    const pids = stdout.split(/\r?\n/).filter(Boolean);
    if (pids.length === 0) {
      log(`No hay procesos usando el puerto ${port}.`);
      return;
    }
    for (const pid of pids) {
      exec(`kill -9 ${pid}`, (e) => {
        if (e) log(`No se pudo terminar PID ${pid}.`);
        else log(`Terminado PID ${pid}.`);
      });
    }
  });
}