import React, {Component} from 'react';
import axios from 'axios';
import './block-component.css';
import {linkBar} from './LinkBar.component';
import {APP_NAME} from "../CONSTANTS";

// function RenderItemList(props) {
//     const lo_item = props.lo_item;
//
//     const listItems = lo_item.map((item) =>
//         <div className="studyItem-spacing-container">
//             <li className="studyItem-container" key={item.toString()}>
//                 {item.toString()}
//             </li>
//         </div>
//     );
//     return (
//         <nav>
//         <ul className={'friendList'}>{listItems}</ul>
//         </nav>
//     );
// }

export default class CreateBlock extends Component {

    constructor(props) {
        super(props);


        this.onChangeSummary = this.onChangeSummary.bind(this);
        this.onChangePublic = this.onChangePublic.bind(this);
        this.onChangeUser2 = this.onChangeUser2.bind(this);
        this.onChangeAgreement = this.onChangeAgreement.bind(this);
        this.onChangeDateOfCompletion = this.onChangeDateOfCompletion.bind(this);
        this.onChangeCompleted = this.onChangeCompleted.bind(this);

        this.onChangeAgreementCondition = this.onChangeAgreementCondition.bind(this);
        this.onChangeAgreementWinnerTrue = this.onChangeAgreementWinnerTrue.bind(this);
        this.onChangeAgreementWinnerFalse = this.onChangeAgreementWinnerFalse.bind(this);
        this.onChangeAgreementAmount = this.onChangeAgreementAmount.bind(this);
        this.onChangeOutcomeAgreeCheck = this.onChangeOutcomeAgreeCheck.bind(this);

        this.handlePublicChange = this.handlePublicChange.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        let currentUser = JSON.parse(localStorage.getItem('user'));
        let user1 = currentUser.user_name;

        this.const_public_equity = ["aEquity Pool 1","bEquity Pool 2", "cEquity Pool 3","dEquity Pool 4","eEquity Pool 5","fEquity Pool 6"];


        this.state = {
            const_public_equity:[],
            equity_pool: this.const_public_equity.slice(),
            public:true,
            user1: user1,
            user2: 'Public',
            is_paper: true,
            agreement:'',
            agreement_condition:'',
            agreement_winner_true:user1,
            agreement_winner_false:'Public',
            agreement_amount:'',
            outcome_agree_check:false,
            completed: false,
            summary: '',
            outcomes:[],
            completion_date:"2019-12-16T20:00",
            block_added:false,
            prev_hash:null,
            loading:false,
            make_open_to_public:true,
            open_search:true,
            };


        this.getFriends();
    }

    getFriends(){
        axios.get('http://localhost:4002/credentials/' + this.state.user1).then((credential)=>{
            this.setState({const_public_equity: credential.data.user_list_current_friends, equity_pool:credential.data.user_list_current_friends.slice()});
        });
    }



    RenderItemList() {
        const lo_item = this.state.equity_pool;

        const listItems = lo_item.map((item, idx) =>
            <div className="studyItem-spacing-container" key={idx}>
                <li onClick={()=>{this.setState({user2:item.toString(),open_search:false,make_open_to_public:false, agreement_winner_false:item.toString()})}} className="studyItem-container" key={idx}>
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

    handlePublicChange = (e) =>{
        this.setState({searchInput: e.target.value},() =>
            this.updatePublicSearch());
    };

    updatePublicSearch() {
        var my_filter = this.state.searchInput.toUpperCase();
        this.setState({equity_pool: this.state.const_public_equity.filter(function(value){
                return value.toUpperCase().indexOf(my_filter) !== -1;
            })});
    };

    onChangeAgreement(e) {
        this.setState({
            agreement: e.target.value
        });
    }
    onChangeAgreementCondition(e) {
        this.setState({
            agreement_condition: e.target.value
        });
    }
    onChangeAgreementWinnerTrue(e) {
        this.setState({
            agreement_winner_true: e.target.value
        });
    }
    onChangeAgreementWinnerFalse(e) {
        this.setState({
            agreement_winner_false: e.target.value
        });
    }
    onChangeAgreementAmount(e) {
        var val = e.target.value;
        var justAPoint = (this.state.agreement_amount.toString().length === 0) && (e.target.value === '.');
        if ((val !== null) && !justAPoint){
            val = val.toString();
            console.log(val);
            if(val.match("^[0-9]*\\.?[0-9]*$")) {
                this.setState({
                    agreement_amount: val
                });
                console.log('passed')
            }
        }

    }
    onChangeOutcomeAgreeCheck(e) {
        this.setState({
            outcome_agree_check: e.target.value
        });
    }
    onChangePublic(e) {
        this.setState({
            public: e.target.value
        });
    }
    onChangeDateOfCompletion(e) {
        this.setState({
            completion_date: e.target.value
        });
    }


    onChangeUser2(e) {
        this.setState({
            user2: e.target.value
        });
    }

    onChangeSummary(e) {
        this.setState({
            summary: e.target.value
        });
    }

    onChangeCompleted(e) {
        this.setState({
            completed: e.target.value
        });
    }

    // Axios.post -> pass the required amount as parameter, if the user's balance is sufficent, decrement and return true, otherwise don't decrement and return false
    creatingUserSufficientBalance(){
        const userToUpdate ={
            user_name:this.state.user1,
            amount:this.state.agreement_amount,
            is_paper:this.state.is_paper
        };
        return axios.post('http://localhost:4002/credentials/decrementUserBalance',userToUpdate)
    }

    createAgreement(){
        this.creatingUserSufficientBalance().then(res =>{

            console.log(res.data);
            console.log('hmm');
            console.log(this.state.outcome_agree_check);
            console.log(this.state.outcome_agree_check==='true');
            console.log(this.state.outcome_agree_check===true);
            console.log((res.data==='true'));
            console.log((res.data===true));

            if((res.data===true) && (this.state.outcome_agree_check)){
                const agreement = {
                    outcome_agree_check:this.state.outcome_agree_check,
                    agreement_condition:this.state.agreement_condition,
                    agreement_winner_true:this.state.agreement_winner_true,
                    agreement_winner_false:this.state.agreement_winner_false,
                    agreement_amount:this.state.agreement_amount,
                    agreement_is_paper:this.state.is_paper
                };
                this.setState({agreement:JSON.stringify(agreement)});
                console.log('agreement created');

                const BlockInfo = {
                    user1: this.state.user1,
                    user2: this.state.user2,
                    agreement: this.state.agreement,
                    completion_date: this.state.completion_date,
                    summary:this.state.summary
                };
                return axios.post('http://localhost:4001/blockinfochain/add', BlockInfo)
            }
            console.log('was false');
            return null;
        }).then(res => {
            this.setState({
                user1: '',
                user2: '',
                agreement:'',
                summary: '',
                completion_date:'',
                block_added: true
            })
        }).catch(err=>{this.setState({
            user1: '',
            user2: '',
            agreement:'',
            summary: '',
            completion_date:'',
            block_added: false
        });console.log('Error in create block component add createAgreement')});

    }


    onSubmit(e) {
        e.preventDefault();
        this.createAgreement();


    }



    render() {
        return (

            <div>
                {linkBar()}
                <h3>Create New Block</h3>
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

                        <div>
                            <label className="switch">
                                <input onChange={()=>{this.setState({make_open_to_public:!this.state.make_open_to_public,user2:'',agreement_winner_false:''})}} type="checkbox" checked={this.state.make_open_to_public}/>
                                <span className="slider"></span>

                            </label>    Allow Public {APP_NAME} Members to Join
                            <br></br>
                        </div>


                        {!this.state.make_open_to_public &&

                        <div className="search">
                            <div className={'searchDiv'}>
                                <input type="text" name="searchInput" className="search-input" onClick={() => {
                                    this.setState({open_search: true});
                                }} onChange={this.handlePublicChange} placeholder="       Find and select a friend..."/>
                            </div>
                        </div>
                        }

                        {!this.state.make_open_to_public &&
                        <ul>{this.RenderItemList()}</ul>
                        }


                        <input  type="text"
                                className="form-control"
                                value={this.state.user2}
                                onChange={this.onChangeUser2}
                                readOnly={this.state.make_open_to_public}
                        />
                    </div>

                    <label><b>Agreement</b></label>

                    <div className="form-group">
                        <label>Date agreement's outcome will be determined</label>

                        <input className="w3-input w3-padding-16" type="datetime-local" placeholder="Date and time" onChange={this.onChangeDateOfCompletion}
                               min="2019-06-07T00:00" max="2040-06-07T00:00" required name="date" value={this.state.completion_date}/>
                    </div>


                    <div className="form-group">
                        <label>Agreement condition</label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.agreement_condition}
                                onChange={this.onChangeAgreementCondition}
                        />
                        <label style={{marginTop:15,marginBottom:15}} >If the condition is <b>true</b>, then the winner will be</label>
                        <select style={{marginLeft:15,marginRight:15}} value={this.state.agreement_winner_true} onChange={this.onChangeAgreementWinnerTrue}>
                            <option  className="form-control" >{this.state.user1}</option>
                            <option className="form-control" >{this.state.user2}</option>
                        </select>


                        <label  style={{marginTop:15,marginBottom:15}}  >If the condition is <b>false</b>, then the winner will be</label>
                        <select style={{marginLeft:15,marginRight:15}} value={this.state.agreement_winner_false} onChange={this.onChangeAgreementWinnerFalse}>
                            <option className="form-control" >{this.state.user1}</option>
                            <option className="form-control" >{this.state.user2}</option>
                        </select>

                        <div className="form-group">
                        <label>The winner of the agreement will get</label>
                        <input  type=""
                                className="form-control"
                                value={this.state.agreement_amount}
                                onChange={this.onChangeAgreementAmount}
                        />
                        </div>
                        <div>
                            <label className="switch">
                                <input onChange={()=>{this.setState({is_paper:!this.state.is_paper})}} type="checkbox" checked={this.state.is_paper}/>
                                <span className="slider"></span>

                            </label>  Paper Currency
                            <br></br>
                        </div>

                        {(this.state.agreement_amount && (this.state.agreement_amount !== 0)) ?
                        <label className="switch">
                            <input onChange={() => {
                                this.setState({outcome_agree_check: !this.state.outcome_agree_check})
                            }} type="checkbox" checked={this.state.outcome_agree_check}/>
                            <span className="slider"></span>
                        </label>
                            : ''
                        }
                        {(this.state.agreement_amount && (this.state.agreement_amount !== 0)) ?
                        <>I understand the possible outcomes of this agreement, and that ${this.state.agreement_amount} USD  of my {this.state.is_paper? 'paper':''} account balance will be held pending the outcome</>
                            : ''
                        }



                    <div className="form-group">
                        <label><b>Summary</b> </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.summary}
                                onChange={this.onChangeSummary}
                        />
                        <div className="modal-footer">
                            <button value="Create Block" onClick={this.onSubmit} type="button" className="btn btn-primary">Create Block</button>
                        </div>
                    </div>


                </div>

                </div>

            </div>
        )
    }
}