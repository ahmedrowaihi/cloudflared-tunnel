import {expect, test} from '@oclif/test'

describe('setup', () => {
  test
  .stdout()
  .command(['setup'])
  .it('setups all cloudflared settings', _ctx => {
    expect(true)
  })
})
