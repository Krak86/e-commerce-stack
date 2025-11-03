import next from 'next'
import { createServer } from 'node:https'
import { parse } from 'node:url'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'app.example.com'
const port = parseInt(process.env.NEXT_PUBLIC_PORT || '3002', 10)
const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME || 'app'
const domainCommon = process.env.NEXT_PUBLIC_DOMAIN_COMMON || 'localhost'
const host = `${domainName}.${domainCommon}`

console.log('Production server configuration:')
console.log(`- Environment: production`)
console.log(`- Hostname: ${hostname}`)
console.log(`- Port: ${port}`)
console.log(`- Certificate host: ${host}`)

// Initialize Next.js app in production mode
const app = next({
  dev: false,  // Always production
  hostname,
  port
})
const handle = app.getRequestHandler()

// HTTPS options
const httpsOptions = {
  key: readFileSync(join(__dirname, 'cert', `${host}-key.pem`)),
  cert: readFileSync(join(__dirname, 'cert', `${host}.pem`))
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, err => {
    if (err) throw err
    console.log(`> Production server ready on https://${hostname}:${port}`)
  })
})
