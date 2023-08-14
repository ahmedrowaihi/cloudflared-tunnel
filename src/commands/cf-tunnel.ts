import {Command, Flags} from '@oclif/core'
import {startTunnel} from '../services'

export default class CfTunnel extends Command {
  static description = 'Start cloudflared tunnel to expose local server to the internet'

  static flags = {
    port: Flags.string({char: 'p', description: 'port to expose (default: 3000)'}),

    host: Flags.string({char: 'h', description: 'host to expose (default: http://localhost)'}),

    setup: Flags.boolean({char: 's', description: 'setup cloudflared tunnel (default: false)'}),
  }

  static usage = Object.entries(CfTunnel.flags)
  .map(([name, flag]) => {
    const {char} = flag
    return flag.type === 'boolean' ? ` [-${char}]` : ` [-${char} <${name}>]`
  })
  .join('')

  public async run(): Promise<void> {
    const {flags} = await this.parse(CfTunnel)
    const port = flags.port ? Number.parseInt(flags.port, 10) : 3000
    const host = flags.host ?? 'http://localhost'
    if (flags.setup) {
      const setup = await import('./setup')
      await setup.default.run()
    } else startTunnel({port, host})
  }
}
