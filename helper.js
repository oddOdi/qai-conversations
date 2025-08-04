const { backOff } = require('exponential-backoff');



async function fetchWithBackoff(url, options, backoffOpts = {}) {
    const defaultBackoff = {
        retry: 5,
        delayFirstAttempt: true,
        jitter: 'full',
    }
    if(!Object.keys(backoffOpts)?.[0]){backoffOpts = defaultBackoff}

    const res = await backOff(
    async () => {
      const r = await fetch(url, options)
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`)
      }
      return r
    },
    backoffOpts
  )
  return res.json()
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}