import React, {Component} from 'react';
import axios from 'axios';
import './signup.css'
import { Redirect } from 'react-router-dom';
import {generateHash} from "../backend/hashUtil";
import {CREDENTIAL_NONCE,USERNAME_OR_PASSWORD_INC,USER_NAME_TAKEN,PASSWORD_WEAK,EMAIL_FORMAT_BAD,EMPTY_USERNAME} from '../CONSTANTS';


export default class Signup extends Component {

    constructor(props) {
        super(props);

        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);

        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.refreshState = this.refreshState.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        this.emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        this.usernameRegex =  new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/);

        this.state = {
            user_name: '',
            user_email:'',
            user_password: '',
            user_name_taken: false,
            user_name_or_pass_inc: false,
            authenticated: false,
            is_sin_up:true,
            password_strong:true,
            email_good_format:true,
            forgot_password:false,
            empty_username:false
        }
    }

    refreshState(e){
        e.preventDefault();
        this.setState({
            user_name: '',
            user_email:'',
            user_password: '',
            user_name_taken: false,
            user_name_or_pass_inc: false,
            authenticated: false,
            is_sin_up:!this.state.is_sin_up,
            password_strong:true,
            email_good_format:true,
            forgot_password:false,
            empty_username:false
        })
    }

    onChangeUserName(e) {
        console.log('would clear error?');
        this.setState({
            user_name: e.target.value
        });
    }

    onChangeUserEmail(e) {
        this.setState({
            user_email: e.target.value
        });
    }

    onChangeUserPassword(e) {
        this.setState({
            user_password: e.target.value
        });
    }

    strongPassword(){
        //TODO check server side as well
        return this.strongRegex.test(this.state.user_password)
    }

    goodEmail() {
        //TODO check server side as well

        return this.emailRegex.test(this.state.user_email);
    }

    goodUsername() {
        //TODO check server side as well
        // Usernames can consist of lowercase and capitals
        // Usernames can consist of alphanumeric characters
        // Usernames can consist of underscore and hyphens and spaces
        // Cannot be two underscores, two hyphens or two spaces in a row
        // Cannot have a underscore, hyphen or space at the start or end
        // Usernames must be greater than 5 characters in length
        return (this.state.user_name.length > 5) && this.usernameRegex.test(this.state.user_name);
    }



    onSinIn(credPass){

        axios.post('http://localhost:4002/credentials/check/'+this.state.user_name, credPass)
            .then(res => {
                console.log("User Sin in complete");

                // Store user for intra-session verification
                let foundUser = res.data[0];
                foundUser.user_password='';
                localStorage.setItem('user', JSON.stringify(foundUser));

                this.setState({authenticated:true, user_password:''});
            })
            .catch(err => {
                console.log('Safely handled error and can show user_name or password is incorrect error');
                this.setState({user_name_or_pass_inc:true, user_password:''});

            });
    }



    onSignUp(credPass) {
        axios.post('http://localhost:4002/credentials/add/'+this.state.user_name, credPass)
            .then(res => {

                // Store user for intra-session verification
                let createdUser = res.data;
                createdUser.user_password='';

                localStorage.setItem('user', JSON.stringify(createdUser));

                this.setState({authenticated:true, user_password:''});
            })
            .catch(err => {
                this.setState({user_name_taken:true, user_password:''});

            });
    }


    onFormSubmit(e){
        e.preventDefault();

        var eu = !this.goodUsername();

        var wp = !this.strongPassword();

        if (this.state.is_sin_up){

            var be = !this.goodEmail();

            if(eu || wp || be){
                if(eu){this.setState({empty_username:true})}
                else{this.setState({empty_username:false})}
                if(wp){this.setState({password_strong:false})}
                else{this.setState({password_strong:true})}
                if(be){this.setState({email_good_format:false})}
                else{this.setState({email_good_format:true})}
                return;
            }
            const credPass = {
                user_name: this.state.user_name,
                user_email: this.state.user_email,
                user_password: generateHash(this.state.user_password, CREDENTIAL_NONCE),
                user_verified: false,
                user_account_balance: 0.00,
                user_block_hashes:[],
                user_paper_account_balance: 2500.00,
                user_borrowed:0.00,
                user_credibility_points: 100.00,
                user_list_current_bets: [],
                user_list_recommended_bets:[],
                user_list_current_friends:['user100','xchnge999','yourFriend21','thefrienderguy'],
                user_list_recommended_friends:['recFriend1','recFriend2','recFriend3','recFriend4','recFriend5','recFriend6'],
                user_friends_requests_outgoing:[],
                user_friends_requests_incoming:[],
                user_block_requests_outgoing:[],
                user_block_requests_incoming:[]
            };
            this.onSignUp(credPass);


        }
        else{


            if(eu || wp){
                if(eu){this.setState({empty_username:true})}
                else{this.setState({empty_username:false})}
                if(wp){this.setState({password_strong:false})}
                else{this.setState({password_strong:true})}
                return;
            }
            const credPass = {
                user_name: this.state.user_name,
                user_password: generateHash(this.state.user_password, CREDENTIAL_NONCE)
            };
            this.onSinIn(credPass);


        }


    }

    getUsernameError(){
        if(this.state.empty_username){return EMPTY_USERNAME;}
        else if (this.state.user_name_taken){return USER_NAME_TAKEN;}
        else if (this.state.user_name_or_pass_inc){return USERNAME_OR_PASSWORD_INC;}
        return "";
    }


    render(){
        return (
            <div>
                {!this.state.authenticated ? (
                    <div className='entireComponent' style={{marginTop: 20}}>
                        <h3>{this.state.is_sin_up ? "Sign up": "Sign in"}</h3>
                        <form>
                            <div className="form-group">
                                <label>Username</label>
                                <input  type="text"
                                        className="form-control"
                                        value={this.state.user_name}
                                        onChange={this.onChangeUserName}

                                />
                                <small className="danger-error">{this.getUsernameError()}</small>
                            </div>
                            {this.state.is_sin_up && (
                            <div className="form-group">
                                <label>Email</label>
                                <input  type="text"
                                        className="form-control"
                                        value={this.state.user_email}
                                        onChange={this.onChangeUserEmail}

                                />
                                <small className="danger-error">{this.state.email_good_format? "":EMAIL_FORMAT_BAD}</small>
                            </div>
                            )}
                            <div className="form-group">
                                <label>Password</label>
                                <input  type="password"
                                        className="form-control"
                                        value={this.state.user_password}
                                        onChange={this.onChangeUserPassword}

                                />
                                <small className="danger-error">{this.state.password_strong? "":PASSWORD_WEAK}</small>
                            </div>

                            <div className="form-group">
                                <input onClick={this.onFormSubmit} type="submit" value={this.state.is_sin_up ? "Sign up": "Sign in"} className="btn btn-primary" />

                                <button className="btn switch" onClick={this.refreshState}>
                                    {this.state.is_sin_up ? "Sign in Instead": "Sign up Instead"}
                                </button>

                                <button className={'forgotPassword'} onClick={()=>(console.log('forgot clicked'))}>forgot your password?</button>

                            </div>

                        </form>
                    </div>
                ) : (
                    <Redirect to='/home'/>
                )}
            </div>
        );

    }
}
