import {bin, install, tunnel} from 'cloudflared'
import {ChildProcess, spawnSync} from 'node:child_process'
import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {resolve} from 'node:path'
import {question} from 'readline-sync'
import {indecator} from '../utils'
import {stdout} from 'node:process'

let stop: ChildProcess['kill'] | undefined

export const TUNNELNAME = 'cflared'
export const CLOUDFLARED_USR_DIR = resolve(homedir(), '.cloudflared')
export const CONFIG_FILE = resolve(CLOUDFLARED_USR_DIR, TUNNELNAME)
export function isInstalled(): boolean {
  stdout.write('Checking for cloudflared binary...\n')
  return existsSync(bin)
}

export function resetConfig(): void {
  const success = spawnSync('rm', ['-rf', CLOUDFLARED_USR_DIR]).status === 0
  if (!success) throw new Error('Failed to reset config, please delete .cloudflared folder manually.')
}

type IConfig = {
	domain: string
	tunnelCreated: boolean
	routeDns: boolean
	tunnelId: string
}
export function getConfig(): IConfig {
  return JSON.parse(readFileSync(resolve(CLOUDFLARED_USR_DIR, TUNNELNAME), {encoding: 'utf-8'}).toString())
}

export function isCredentialsFilesExist(): boolean {
  // check if .cloudflared folder exists
  if (!existsSync(CLOUDFLARED_USR_DIR)) return false
  const files = readdirSync(CLOUDFLARED_USR_DIR)
  // check if any of the files is missing
  return ['cert.pem', TUNNELNAME].every((file: string) => files.includes(file))
}

export function isTunnelCreated(): boolean {
  return getConfig().tunnelCreated
}

export function isAllReady(): boolean {
  return ['domain', 'tunnelCreated', 'tunnelId', 'routeDns'].every((key: string) => Boolean(getConfig()[key as keyof IConfig]))
}

export function updateConfig(config: Partial<IConfig>): void {
  if (!existsSync(CONFIG_FILE)) writeFileSync(CONFIG_FILE, JSON.stringify({}), {encoding: 'utf-8'})
  writeFileSync(CONFIG_FILE, JSON.stringify({...getConfig(), ...config}), {encoding: 'utf-8'})
}

type Tunnel = { id: string; name: string }
export function isRemoteTunnelExist(): Tunnel | undefined {
  const result = spawnSync(bin, ['tunnel', 'list'])
  let tunnel: Tunnel | undefined
  if (result.status === 0) {
    const tunnels = result.stdout.toString().trim().split('\n').slice(2)
    for (const line of tunnels) {
      const [id, name] = line.trim().split(/\s+/)
      if (name === TUNNELNAME) {
        tunnel = {id, name}
        break
      }
    }

    return tunnel
  }

  throw new Error('Failed to check for existing tunnels.')
}

export function createTunnel(): void {
  const tunnelExist = isRemoteTunnelExist()
  if (tunnelExist) {
    updateConfig({tunnelCreated: true, tunnelId: tunnelExist.id})
    return
  }

  const result = spawnSync(bin, ['tunnel', 'create', TUNNELNAME], {stdio: 'inherit'})
  if (result.status !== 0) throw new Error('Failed to create tunnel.')
  const files = readdirSync(CLOUDFLARED_USR_DIR)
  // find a file with .json extension
  const tunnelId = files.find((file: string) => file.endsWith('.json'))
  updateConfig({tunnelCreated: true, tunnelId})
}

const authorizeDomain = (): void => {
  let domain = ''
  let confirm = ''
  while (confirm.toLowerCase() !== 'y') {
    domain = question('Enter your authorized domain (e.g. example.com): \n')
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, '') // remove http(s)://, www. and trailing slash
    confirm = question(`You entered ${domain}, is this correct? (y/n) \n`)
  }

  // add domain to config
  updateConfig({domain})
}

export function login(): void {
  if (spawnSync(bin, ['login'], {stdio: 'inherit'}).status === 0) authorizeDomain()
  else throw new Error('Failed to login.')
}

export function routeDnsToTunnel(): void {
  const {domain, routeDns} = getConfig()
  if (routeDns) return
  const result = spawnSync(bin, ['tunnel', 'route', 'dns', '-f', TUNNELNAME, `${TUNNELNAME}.${domain}`])
  if (result.status === 0) updateConfig({routeDns: true})
}

export async function startTunnel({port, host}: { port: number; host: string }): Promise<void> {
  routeDnsToTunnel()
  const spinner = indecator()
  spinner.start('Starting tunnel...')
  const {url, connections, child, stop: _stop} = tunnel({'--url': `${host}:${port}`, tunnel: TUNNELNAME})
  console.log(`\n===================================\nExposing: ${host}:${port}\nSecure tunnel URL: ${await url}\nConnections Ready! ${JSON.stringify(await Promise.all(connections))}\n===================================\n`)
  spinner.stop('Tunnel started. Press Ctrl+C to stop.')

  stop = _stop
  await new Promise(resolve => {
    child.on('exit', resolve)
  })
}

export function stopTunnel(): void {
  if (!stop) return
  stop()
  stop = undefined
}

export async function installBinary(): Promise<void> {
  if (isInstalled()) {
    stdout.write('Cloudflared binary found. Skipping installation.')
    return
  }

  const spinner = indecator()
  spinner.start('Installing cloudflared binary...')
  const installResult = (await install(bin)
  .then(() => ({
    text: 'Installed cloudflared binary.',
    type: 'success',
  }))
  .catch(error => ({
    text: 'Failed to install cloudflared binary.',
    type: 'error',
    error: error,
  }))) as {
		text: string
		type: 'success' | 'error'
		error?: Error
	}
  spinner.stop(installResult.text)
  if (installResult.error) throw installResult.error
}
