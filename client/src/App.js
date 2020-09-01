import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Products from './components/Products'
import Customer from './components/Customer'

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Products} />
                <Route exact path="/customer" component={Customer} />
                <Route
                    exact
                    path="/orders"
                    render={() =>
                        (window.location =
                            'https://transactions-avanta.myshopify.com/admin/orders?selectedView=all')
                    }
                />
            </Switch>
        </Router>
    )
}

export default App
