export function indecator(): {
	stop: (string?: string) => void
	start: (string?: string) => void
	} {
  const spinner = ['-', '\\', '|', '/']
  let i = 0

  let interval: NodeJS.Timeout

  return {
    stop(string) {
      if (interval) clearInterval(interval)
      if (string) process.stdout.write(`${string}\n`)
    },
    start(string) {
      interval = setInterval(() => {
        process.stdout.write(`\r${spinner[i++]} ${string}...`)
        i &= 3
      }, 100)
    },
  }
}
