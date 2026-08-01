const { spawn } = require('node:child_process')
const path = require('node:path')

const port = process.env.PORT || 3000
const nextBin = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'bin', 'next')

const child = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
  stdio: 'inherit',
})

child.on('exit', (code) => process.exit(code ?? 1))
child.on('error', (err) => {
  console.error('Failed to start Next.js server:', err)
  process.exit(1)
})
