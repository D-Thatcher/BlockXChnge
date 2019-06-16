import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import {logout} from "./userLogout";

export default class NoMatch extends Component {

    constructor(props) {
        super(props);
        this.state = {user: {}};
    }

    render() {
        logout();
        return (
            <Redirect to={{
                pathname: '/home',
                state: {user_name:this.state.user_name}
            }}
            />
        )
    }
}