import {stdout} from 'node:process'
import {createTunnel, installBinary, isCredentialsFilesExist, isInstalled, isTunnelCreated, login} from '../services'
export async function setup(): Promise<void> {
  if (isInstalled()) stdout.write('Cloudflared binary found. Skipping installation.\n')
  else installBinary()
  if (!isCredentialsFilesExist()) login()
  if (!isTunnelCreated()) createTunnel()
}
