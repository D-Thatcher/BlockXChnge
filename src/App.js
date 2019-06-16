import React, { Component } from "react";
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import About from "./components/about.component";
import Account from "./components/account.component";
import Blockchain from "./components/blockchain.component";
import SignupPage from './components/signup.page';
import NoMatch from './components/NoMatch.component';
import BlockInfochain from './components/block-info.component';
import JoinBlock from './components/JoinBlock.component';
import DepositForm from './components/payment.component';
import CreateBlock from './components/create-block.component'
import Home from './components/home.component';
import {PrivateRoute} from './PrivateRoute';


class App extends Component {
    render() {
        return (
            <Router>
                    <Switch>
                        <Route exact path="/" component={SignupPage} />

                        <PrivateRoute path="/home" component={Home} />
                        <PrivateRoute path="/about" component={About} />
                        <PrivateRoute path="/account" component={Account} />
                        <PrivateRoute path="/blockchain" component={Blockchain} />
                        <PrivateRoute path="/activeBlocks" component={BlockInfochain} />
                        <PrivateRoute path="/createBlock" component={CreateBlock} />
                        <PrivateRoute path="/joinBlock" component={JoinBlock} />
                        <PrivateRoute path="/deposit" component={DepositForm} />


                        <Route component={NoMatch} />
                    </Switch>
            </Router>
        );
    }
}

export default App;