const Login = require('../pages/login')

describe('login', () => {
  it('logs user in', () => {
    Login.open()
    browser.saveAndDiffScreenshot('login')
    Login.login()
  })
})
