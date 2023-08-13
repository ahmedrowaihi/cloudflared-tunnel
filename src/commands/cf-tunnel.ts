import {Command, Flags} from '@oclif/core'
import {startTunnel} from '../services'

export default class CfTunnel extends Command {
  static description = 'Start cloudflared tunnel to expose localhost to the internet';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    port: Flags.string({char: 'p', description: 'port to expose (default: 3000)'}),

    host: Flags.string({char: 'h', description: 'host to expose (default: http://localhost)'}),
  };

  public async run(): Promise<void> {
    const {flags} = await this.parse(CfTunnel)
    const port = flags.port ? Number.parseInt(flags.port, 10) : 3000
    const host = flags.host ?? 'http://localhost'

    await startTunnel({port, host})
  }
}
