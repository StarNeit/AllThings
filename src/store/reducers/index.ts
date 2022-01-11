import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { createMemoryHistory, History } from 'history'

import app from './app'
import authentication from './authentication'
import booking from './booking'
import consumption from './consumption'
import documents from './documents'
import form from './form'
import header from './header'
import information from './information'
import james from './james'
import marketplace from './marketplace'
import notifications from './notifications'
import pinboard from './pinboard'
import serviceCenter from './serviceCenter'
import theme from './theme'
import utilisationPeriods from './utilisationPeriods'
import whoIsWho from './whoIsWho'

const createRootReducer = (history: History = createMemoryHistory()) =>
  combineReducers({
    app,
    router: connectRouter(history),
    authentication,
    booking,
    consumption,
    documents,
    form,
    header,
    information,
    james,
    marketplace,
    notifications,
    pinboard,
    serviceCenter,
    theme,
    utilisationPeriods,
    whoIsWho,
  })

export default createRootReducer

export type AppState = ReturnType<ReturnType<typeof createRootReducer>>
