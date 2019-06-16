import React, {Component} from 'react';
import {APP_NAME} from '../CONSTANTS';
import {linkBar} from './LinkBar.component';

export default class About extends Component {

    constructor(props) {
        super(props);
        this.state = {user: {}};
    }

    render() {
        return (
            <div>
                {linkBar()}
            <h1>About {APP_NAME}</h1>
            <p>TODO this is text on the pagethis is text on the pagethis is text on the pagethis is text on the pagethis is text on the pagethis is text on the page</p>
            </div>)
    }
}