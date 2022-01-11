const { addTerms } = require('./poeditor')
const { extractMessages } = require('@allthings/react-intl-extract-messages')

const idMap = {}
const messages = extractMessages('../tsconfig.json')

const parsedMessages = messages.reduce((prev, message) => {
  const { id, defaultMessage, description } = message
  if (/[A-Z]/.test(id)) {
    throw new Error(id + ' contains upper case letters')
  }
  if (!description) {
    // eslint-disable-next-line no-console
    console.warn(id + ' has no description')
  }
  if (idMap.hasOwnProperty(id)) {
    throw new Error(`Duplicate message id: ${id}`)
  } else {
    prev.push({
      term: id,
      reference: defaultMessage,
      comment: description || '',
    })
  }
  return prev
}, [])

// eslint-disable-next-line no-console
addTerms(parsedMessages).then(res => console.log(res))
