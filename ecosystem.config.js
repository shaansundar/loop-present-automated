module.exports = {
  apps : [{
    name   : "loop-automated",
    script : "./index.ts",
    interpreter: 'bun',
    time: true,
    restart_delay: 10000,
    log_date_format: "DD-MM-YYYY HH:mm Z",
    log_file: './logs/loop-automated.log',
  }]
}
