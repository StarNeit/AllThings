type Mixpanel = (...args: any[]) => void

const trackMixpanel: Mixpanel = (...args) => {
  if (typeof mixpanel !== 'undefined') {
    mixpanel.track(...args)
  }
}

export { trackMixpanel as mixpanel, Mixpanel }
