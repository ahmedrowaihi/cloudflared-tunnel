import {Hook} from '@oclif/core'
import setup from '../../commands/setup'
const hook: Hook<'init'> = async function () {
  await setup.run()
}

export default hook

