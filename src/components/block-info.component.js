import React, {Component} from 'react';
import axios from 'axios';
import {linkBar} from './LinkBar.component';



function prettifyAgreement(agreement){
    let ag = JSON.parse(agreement);
    let p ='Paper';
    if(ag.agreement_is_paper==='false'){p=''}
    return ag.agreement_condition + ' $' + ag.agreement_amount +' ' + p
}

const Block = props => (
    <tr>
        <td>{props.block.user1}</td>
        <td>{props.block.user2}</td>
        <td>{prettifyAgreement(props.block.agreement)}</td>
        <td>{props.block.completion_date}</td>
        <td>{props.block.summary}</td>
    </tr>
);



export default class BlockInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {blockchain: []};
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        axios.get('http://localhost:4001/blockinfochain/')
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
                <h3>Active Blocks</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                    <tr>
                        <th>User1</th>
                        <th>User2</th>
                        <th>Agreement</th>
                        <th>Completion Date</th>
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