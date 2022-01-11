const storeLocationIfStandalone = (fileName: string, fileUrl: string) => {
  const { localStorage, location, navigator } = window
  const isStandAloneApp = (navigator as any).standalone
  const fileError = fileName
    ? `No file with name ${fileName}`
    : 'File does not exist'

  if (fileUrl && isStandAloneApp) {
    localStorage.setItem('lastVisited', location.pathname)
  } else if (!fileUrl) {
    throw new Error(fileError)
  } else {
    null
  }
}

export default storeLocationIfStandalone
