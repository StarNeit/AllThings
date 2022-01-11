// This file gets required in the Webdriver.io "before" hook

// Global config:
const config = {
  checkInCode: 'space-pilot-3000',
  user: {
    email: 'e2e-testing@allthings.me',
    password: 'PleaseInsertLiquor!',
  },
  user2: {
    email: 'e2e-testing2@allthings.me',
    password: 'WhyMotZoidberg?',
  },
}

Object.assign(global, { config })
