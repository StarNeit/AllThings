export default function extractContainerData(id: string) {
  const container = document.getElementById(id)

  if (!container) {
    return {}
  }

  const stateString = container.getAttribute('data-state')

  container.parentNode.removeChild(container)

  try {
    return JSON.parse(stateString)
  } catch (error) {
    throw new Error(`Corrupted state: "${stateString}"`)
  }
}
