import React, {Component} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import './block-component.css';
import {linkBar} from './LinkBar.component';



export default class JoinBlock extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

        let user_joining = JSON.parse(localStorage.getItem('user'));
        let user2 = user_joining.user_name;
        let user2_account_balance = user_joining.user_account_balance;
        let user2_paper_account_balance = user_joining.user_paper_account_balance;


        this.state = {
            parsed_agreement : JSON.parse(this.props.location.state.agreement),
            user1:this.props.location.state.user1,
            user2: user2,
            user2_paper_account_balance:user2_paper_account_balance,
            user2_account_balance:user2_account_balance,
            agreement:this.props.location.state.agreement,
            join_completed: false,
            summary: this.props.location.state.summary,
            outcomes:this.props.location.state.outcomes,
            completion_date:this.props.location.state.completion_date,
            block_added:false,
            prev_hash:null,
            block_id:this.props.location.state.block_id
        };

        this.state.hold_bet = '';
    }

    updateLocalStorageUser(){
        // Changeable items: current_bets
        let user = localStorage.getItem('user');
        let parsed = JSON.parse(user);
        parsed.user_list_current_bets.push(this.state.hold_bet);
        localStorage.setItem('user', JSON.stringify(parsed));

    }


    componentWillUnmount () {
        this.updateLocalStorageUser();
    }

    updateUsersActiveBlocks(user_name){
        console.log('updating active block');
        console.log(user_name);
        var BlockInfo = {
            user1: this.state.user1,
            user2: this.state.user2,
            agreement: this.state.agreement,
            completion_date: this.state.completion_date,
            summary:this.state.summary
        };

        const jsonInfo = JSON.stringify(BlockInfo);
        this.setState({hold_bet:jsonInfo});

        const Info = {
            user_name:user_name,
            block_to_add: jsonInfo
        };


        return axios.post('http://localhost:4002/credentials/updateUserCurrentBlock', Info)

    }

    // Asynchronously gets the previous hash
    axiosPostHash() {
        //todo
        //// First check if the user has sufficient balance
        //  Also offer to loan money instead
        // removes it from the public blocks, and adds it to the
        // block chain, and both users' active blocks.
        console.log('in post hash');
         let myParam = {
            user1: this.state.user1,
                user2: this.state.user2,
                agreement: this.state.agreement,
                completion_date: this.state.completion_date,
                summary:this.state.summary
        };
         console.log('passng');
         console.log(myParam);

        return axios.get('http://localhost:4000/blockchain/getLast2',{
            params: {
                user1: this.state.user1,
                user2: this.state.user2,
                agreement: this.state.agreement,
                completion_date: this.state.completion_date,
                summary:this.state.summary
            }
        })
    }


    findAndRemovePublicBlock(){
        console.log('removing block from info chain');
        return axios.get('http://localhost:4001/blockinfochain/remove/' + this.state.block_id)
    }


    // Asynchronously gets the previous hash
    // axiosJoinBlock() {
    //     console.log("axiosJoinBlock called");
        // First check if the user has sufficient balance
        // Also offer to loan money instead
        // Finds this un hashed block in the db-If it doesn't find it, notify user block is no longer available, hashes it, removes it from the uncompleted blocks, and adds it to the
        // block chain, and both users' active blocks.
        // return axios.get('http://localhost:4000/blockchain/join',{
        //     params: {
        //         user1: this.state.user1,
        //         user2: this.state.user2,
        //         agreement: this.state.agreement,
        //         completion_date: this.state.completion_date,
        //         summary:this.state.summary
        //     }
        // }).catch(err=>{console.log('Error in create block component getLast2 axiosPostHash')})
    // }

    onSubmit(e){
        e.preventDefault();


        // this.updateUsersActiveBlocks(this.state.user1);

        axios.all([
            this.axiosPostHash(),
            this.updateUsersActiveBlocks(this.state.user1),
            this.updateUsersActiveBlocks(this.state.user2),
            this.findAndRemovePublicBlock()
        ]);

        // this.axiosPostHash().then((res)=>{
        //     return this.updateUsersActiveBlocks(this.state.user1).then((res2)=>{
        //          return this.updateUsersActiveBlocks(this.state.user2).then((res3)=> {
        //             return this.findAndRemovePublicBlock()
        //         });
        //     });
        // });


        this.setState({
            public:true,
            user1: '',
            user2: '',
            agreement:'',
            completed: false,
            summary: '',
            outcomes:[],
            completion_date:'',
            block_added:true,
            join_completed:true
        });


    }



    render() {
        return (
            <div style={{marginTop: 20}}>
                {linkBar()}
                <h3>Join Block</h3>
                <div>
                    <div className="form-group">
                        <label><b>First Member</b> </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.user1}
                                readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><b>Second Member</b> </label>


                        <input  type="text"
                                className="form-control"
                                value={this.state.user2}
                                readOnly={true}
                        />
                    </div>


                    <div className="form-group">
                        <label><b>Date Agreement Will Occur</b></label>
                        <input className="w3-input w3-padding-16" type="datetime-local" placeholder="Date and time"
                               required name="date" value="2017-11-16T20:00" readOnly={true}/>
                    </div>


                    <div className="form-group">
                        <label><b>Agreement</b></label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.agreement}
                                readOnly={true}
                        />
                    </div>
                    <div className="form-group">
                        <label><b>Summary</b> </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.summary}
                                readOnly={true}
                        />

                    </div>
                    {this.state.join_completed? (<div><label>Block Successfully Joined.</label><Link to={'/home'}>Back Home</Link></div>):(<div>
                        <button type="submit" onClick={this.onSubmit} value="Join Block" />
                    </div>)}





                </div>

            </div>
        )
    }
}