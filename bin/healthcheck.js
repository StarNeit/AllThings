#!/usr/bin/env node

/* eslint-disable no-console */

'use strict'

require('http')
  .request(
    {
      method: 'HEAD',
      host: 'localhost',
      port: process.env.PORT || 3000,
      path: '/connection-status',
    },
    response => console.log('Status:', response.statusCode)
  )
  .end()
