// This is a simple method to check for the availability of a file without
// bloating the client by downloading it completely.
const isFileAvailable = async (url: string) => {
  // Append a timestamp to the URL , as a cross-origin request from cache can
  // potentialy be failing after a regular request is cached.
  // https://bugs.chromium.org/p/chromium/issues/detail?id=409090
  const { status } = await fetch(`${url}?t=${Date.now()}`, {
    method: 'HEAD',
  })
  return status === 200
}

export default isFileAvailable
