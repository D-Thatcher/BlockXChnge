import React, {Component} from 'react';
import {linkBar} from './LinkBar.component';
import {logout} from "./userLogout";
import {Link} from "react-router-dom";
import './block-component.css';
import axios from "axios";
import {APP_NAME} from "../CONSTANTS";



export default class Account extends Component {

    constructor(props) {
        super(props);
        let user = localStorage.getItem('user');


        this.state = JSON.parse(user);

        this.state.slice_user_list_current_friends = this.state.user_list_current_friends.slice();
        this.state.searchInput = '';
        this.updateUserInfo();
        this.state.show_balance = '';
        this.state.show_paper_balance = '';


        this.handlePublicChange = this.handlePublicChange.bind(this);



    }
    sumBlockBalance(block_list){
        let amount_so_far = 0;
        let amount_paper_so_far = 0;

        var i;
        for (i = 0; i < block_list.length; i++) {
            let currBlock = block_list[i];
            let agr = JSON.parse(JSON.parse(currBlock).agreement);



            if(agr.agreement_is_paper){
                console.log(Number(agr.agreement_amount));
                console.log("Number(agr.agreement_amount))");

                amount_paper_so_far+= Number(agr.agreement_amount);
            }
            else{

                amount_so_far+= Number(agr.agreement_amount);
            }
        }
        return [amount_so_far,amount_paper_so_far]
    }


    updateUserInfo(){
        axios.get('http://localhost:4002/credentials/'+this.state.user_name).then(res=>{
            let updatedUser = res.data;

            // For each bet, sum the amounts and make show balance the sum of amounts and current_balance
            var amountTwo = this.sumBlockBalance(updatedUser.user_list_current_bets);

            var amount_so_far = amountTwo[0];
            var amount_paper_so_far = amountTwo[1];

            let update_show_balance = amount_so_far + updatedUser.user_account_balance;
            let update_paper_show_balance = amount_paper_so_far+ updatedUser.user_paper_account_balance;



            this.setState({user_account_balance:updatedUser.user_account_balance,
                user_paper_account_balance:updatedUser.user_paper_account_balance,
                user_list_current_friends:updatedUser.user_list_current_friends,
                user_list_current_bets:updatedUser.user_list_current_bets,
                show_balance:update_show_balance,
                show_paper_balance:update_paper_show_balance
                })

        })
    }

    handlePublicChange = (e) =>{
        this.setState({searchInput: e.target.value},() =>
            this.updatePublicSearch());
    };

    updatePublicSearch() {
        var my_filter = this.state.searchInput.toUpperCase();
        this.setState({slice_user_list_current_friends: this.state.user_list_current_friends.filter(function(value){
                return value.toUpperCase().indexOf(my_filter) !== -1;
            })});
    };

    RenderItemList(lo_item) {
        const listItems = lo_item.map((item, idx) =>
            <div className="studyItem-spacing-container" key={idx}>
                <li className="studyItem-container" key={idx}>
                    {item.toString()}
                </li>
            </div>
        );
        return (
            <nav>
                <ul className={'friendList'}>{listItems}</ul>
            </nav>
        );
    }
    RenderBlockList(lo_item) {
        const listItems = lo_item.map((item, idx) =>
            <div className="studyItem-spacing-container" key={idx}>
                <li className="studyItem-container" key={idx}>
                    {this.prettifyItem(item)}
                </li>
            </div>
        );
        return (
            <nav>
                <ul className={'friendList'}>{listItems}</ul>
            </nav>
        );
    }
    prettifyAgreement(ag){
        let p ='Paper';
        if(ag.agreement_is_paper==='false'){p=''}
        return ag.agreement_condition + ' $' + ag.agreement_amount +' ' + p
    }

    prettifyItem(item){
        let myItem = JSON.parse(item.toString());
        return myItem.user1 + ' - ' + this.prettifyAgreement(JSON.parse(myItem.agreement)) + ' ' + myItem.completion_date + ' - '+myItem.user2;
    }


    render() {
        return (
            <div>{linkBar()}


                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Account Balance</th>
                        <th>Amount on Hold Pending Block Outcomes</th>
                        <th>Paper Account Balance</th>
                        <th>Paper Amount on Hold Pending Block Outcomes</th>
                        <th>Borrowed</th>

                    </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><b>{this.state.user_name}</b></td>
                            <td>{this.state.show_balance === 0? (<Link to='/deposit' style={{backgroundColor: 'White'}} className='depositButton' >Deposit</Link>):this.state.show_balance}</td>
                            <td className={'completed'}>{this.state.show_balance- this.state.user_account_balance}</td>
                            <td>{this.state.show_paper_balance === 0? (<Link to='/deposit' style={{backgroundColor: 'White'}} className='depositButton' >Deposit</Link>):this.state.show_paper_balance}</td>
                            <td>{this.state.show_paper_balance - this.state.user_paper_account_balance}</td>
                            <td> {this.state.user_borrowed}</td>

                        </tr>
                    </tbody>
                </table>
                <hr/>
                <div className={'depositWrapper'}>
                <Link to='/deposit' className='depositButton' >Deposit</Link>
                    <p className="w3-large" style={{paddingLeft:20}}>To add money to your account, select the deposit button. On top of every dollar added to your account, we'll add an additional $5 of paper {APP_NAME} currency.  <Link to='/deposit' className="readyDeposit"> ready to get started?</Link></p>

                </div>
                <hr/>

                <div className={'flexIt'}>

                    <div className={'friendWrapper'}>
                        <div style={{ display: "flex"}}>
                            <h3>Friends</h3>
                            <div className="search">
                                <div className={'searchDiv'}>
                                    <input type="text" name = "searchInput" className="search-input"  onChange={this.handlePublicChange} placeholder="       Find a friend to invite..." />
                                </div>
                            </div>
                        </div>

                        <ul className={'ulFriend'}>{this.RenderItemList(this.state.slice_user_list_current_friends)}</ul>
                    </div>

                <div className={'activeBlockWrapper'}>
                    <h3>Your Active Blocks</h3>
                    <ul >{this.RenderBlockList(this.state.user_list_current_bets)}</ul>
                </div>




                </div>


                <Link to='/' className='pseudoButton' onClick={this.logout}>Logout</Link>

            </div>)
    }
}