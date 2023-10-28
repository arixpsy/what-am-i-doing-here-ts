import os from 'os'

export const getPerfomance = () => {
  return {
    cpus: os.cpus(),
    loadAverage: os.loadavg()[0],
    freeMemory: os.freemem(),
    totalMemory: os.totalmem(),
    uptime: os.uptime(),
    version: os.version()
  }
}