'use strict'
const injectMixpanel = function(data) {
  window.logs = []
  function createTrack(type) {
    return function() {
      window.logs.push({ type: type, data: arguments })
    }
  }
  window.mixpanel = {
    register: createTrack('register'),
    identify: createTrack('identify'),
    track: createTrack('track'),
    people: {
      set: createTrack('people.set'),
    },
  }
}

module.exports = {
  tags: ['analytics'],

  'check if mixpanel gets called': browser => {
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
      .url(`${browser.launchUrl}/service-center`)

    browser
      .waitForElementPresent('[data-e2e=app-ready]')
      .execute(injectMixpanel)
      .click('[data-e2e=service-chooser-microapp-booking-inactive]')

    // expect overwritten ga function to have something in the logs
    browser.execute(
      function(data) {
        return window.logs
      },
      [],
      data => {
        const tracking = data.value
        browser.assert.ok(
          tracking.find(
            track =>
              track.type === 'track' && track.data[1].path === '/booking',
          ),
        )
      },
    )

    browser.end()
  },
}
