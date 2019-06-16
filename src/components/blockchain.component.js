import React, {Component} from 'react';
import axios from 'axios';
import {linkBar} from './LinkBar.component';

const Block = props => (
    <tr>
        <td className={props.block.completed ? 'completed' : ''}>{props.block.block_hash}</td>
        <td className={props.block.completed ? 'completed' : ''}>{props.block.summary}</td>
    </tr>
);

export default class Blockchain extends Component {

    constructor(props) {
        super(props);
        this.state = {blockchain: []};
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('http://localhost:4000/blockchain/')
            .then(response => {
                if (this._isMounted) {
                    this.setState({blockchain: response.data});
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentWillUnmount () {
        this._isMounted = false;

    }


    blockList() {
        return this.state.blockchain.map(function(currentBlock, i) {
            return <Block block={currentBlock} key={i} />;
        });
    }

    render() {
        return (
            <div>
                {linkBar()}
                <h3>Blockchain</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                    <tr>
                        <th>Block Hash</th>
                        <th>Summary</th>
                    </tr>
                    </thead>
                    <tbody>
                    { this.blockList() }
                    </tbody>
                </table>
            </div>
        )
    }
}