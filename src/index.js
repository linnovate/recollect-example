import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios';
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
injectTapEventPlugin()
const dest = document.getElementById('content')
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})
const store = (window.devToolsExtension
  ? window.devToolsExtension()(createStore)
  : createStore)(reducer)

const showResults = values =>
  new Promise(resolve => {
    // setTimeout(() => {
    //   // simulate server latency
    //   window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
    //   resolve()
    // }, 500)
    values.type = 'bid';
    axios.post('/send', values)
    .then((response) => {
      resolve();
    })
    .catch((error) => {
      console.log(error, 'error sending event', error);
    });
  })

let render = () => {
  const MaterialUiForm = require('./MaterialUiForm').default
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <h2>Recollect example</h2>
          <MaterialUiForm onSubmit={showResults} />
      </MuiThemeProvider>
    </Provider>,
    dest
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = error => {
    const RedBox = require('redbox-react')
    ReactDOM.render(<RedBox error={error} className="redbox" />, dest)
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  const rerender = () => {
    setTimeout(render)
  }
  module.hot.accept('./MaterialUiForm', rerender)
  module.hot.accept('./MaterialUi.md', rerender)
  module.hot.accept('!!raw-loader!./MaterialUiForm', rerender)
  module.hot.accept('!!raw-loader!./asyncValidate', rerender)
}

render()
