import {expect, test} from '@oclif/test'
import {existsSync} from 'node:fs'
import {bin} from 'cloudflared'
describe('setup cloudflared', () => {
  test
  .stdout()
  .command(['setup'])
  .it('setups all cloudflared settings', ctx => {
    if (existsSync(bin)) {
      expect(ctx.stdout).to.contain('Cloudflared binary found. Skipping installation.')
    } else {
      expect(ctx.stdout).to.contain('Installed cloudflared binary.')
    }
  })
})
