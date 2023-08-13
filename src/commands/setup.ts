import {Command} from '@oclif/core'
import {setup} from '../scripts'

export default class Setup extends Command {
  public async run(): Promise<void> {
    await setup()
  }
}

