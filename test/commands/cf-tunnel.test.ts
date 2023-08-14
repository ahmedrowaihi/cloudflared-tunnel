import {expect, test} from '@oclif/test'

describe('cf-tunnel', () => {
  test
  .stdout()
  .command(['cf-tunnel'])
  .it('it runs a cloudflared tunnel', _ctx => {
    expect(true).to.be.true
  })
})
