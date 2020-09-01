import React from 'react'
import ReactDOM from 'react-dom'
import '@shopify/polaris/dist/styles.css'
import translations from '@shopify/polaris/locales/en.json'
import { AppProvider } from '@shopify/polaris'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import store from './store'
import './index.css'
import App from './App'

ReactDOM.render(
    <Provider store={store}>
        <AppProvider i18n={translations}>
            <App />
        </AppProvider>
    </Provider>,
    document.getElementById('root')
)
