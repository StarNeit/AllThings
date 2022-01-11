/* eslint-disable no-console */
const fetch = require('cross-fetch')
const querystring = require('querystring')

const API_TOKEN = process.env.POEDITOR_TOKEN

const PUSH_TO_PROJECTS = [73515, 136001, 136003, 136005]

if (!API_TOKEN) {
  // eslint-disable-next-line
  console.error(
    'To use POEDITOR export & import, please set your POEDITOR_TOKEN environment variable',
  )
  process.exit(1)
}

function poeditor(path, data) {
  return fetch(`https://api.poeditor.com/v2/${path}`, {
    body: querystring.stringify({ api_token: API_TOKEN, ...data }),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  })
    .then(r => r.json())
    .then(r => {
      if (r.response.code !== '200') {
        throw new Error(`Unexpected response: ${JSON.stringify(r)}`)
      }
      return r.result
    })
}

function getLocales(language) {
  let data = 'api_token=' + API_TOKEN
  data += '&action=export'
  data += '&id=73515'
  data += '&type=json'
  data += '&language=' + language

  return fetch('https://poeditor.com/api/', {
    method: 'post',
    body: data,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  })
    .then(content => content.json())
    .then(({ item, response }) => {
      if (response.code !== '200') {
        throw response.message
      }
      return fetch(item).then(result => result.json())
    })
}

async function addTerms(projectTerms) {
  const termsSplit = []
  for (let i = 0, j = projectTerms.length; i < j; i += 50) {
    termsSplit.push(projectTerms.slice(i, i + 50))
  }

  try {
    PUSH_TO_PROJECTS.forEach(async projectId => {
      const { project } = await poeditor('projects/view', {
        id: projectId,
      })
      const liveTerms = await poeditor('terms/list', {
        id: projectId,
      }).then(r => r.terms.reduce((acc, term) => acc.concat(term.term), []))

      const newTerms = projectTerms.filter(
        item => liveTerms.indexOf(item.term) === -1,
      )

      if (newTerms.length > 0) {
        const add = await poeditor('terms/add', {
          id: projectId,
          data: JSON.stringify(newTerms),
        })
        console.log(`${project.name}: Added ${add.terms.added} terms`)
      } else {
        console.log(`${project.name}: No new terms`)
      }
    })
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getLocales,
  addTerms,
}
