import React, {Component} from 'react';
import {linkBar} from './LinkBar.component';
// import './signup.css';
import './block-component.css';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import logo2 from "../rsz_2231.png";
import './friendStyle.css';
import './friendCardStyle.css'





export default class Home extends Component {

    constructor(props) {
        //add recFriend1- 6
        super(props);
        let user = localStorage.getItem('user');
        this.state = JSON.parse(user);


        this.RenderBetList = this.RenderBetList.bind(this);
        this.state.publicBetList = [];
        this.state.blockchain = [];

        this.state.slicePublicBetList = this.state.publicBetList.slice();
        this.blockLink = this.blockLink.bind(this);
        this.state.searchInput = '';
        this.state.only_paper_browse = false;
        this.handlePublicChange = this.handlePublicChange.bind(this);
        this._isMounted = false;
        this.state.redirect = false;

        // Selected Block States

        this.state.selected_block_id=null;
        this.state.selected_user1='';
        this.state.selected_agreement='';
        this.state.selected_summary='';
        this.state.selected_outcomes=['', ''];
        this.state.selected_completion_date='';

        this.updatePublicBlocks = this.updatePublicBlocks.bind(this);
        this.updateLocalStorageUser = this.updateLocalStorageUser.bind(this);
        this.RenderRecFriendList = this.RenderRecFriendList.bind(this);
        this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    }

    updateLocalStorageUser(){
        // Changeable items: recommended friends, current friends, friend request incoming, friend request outgoing
        let user = localStorage.getItem('user');
        let parsed = JSON.parse(user);
        parsed.user_list_recommended_friends = this.state.user_list_recommended_friends;
        parsed.user_list_current_friends = this.state.user_list_current_friends;
        parsed.user_friends_requests_incoming = this.state.user_friends_requests_incoming;
        parsed.user_friends_requests_outgoing = this.state.user_friends_requests_outgoing;
        localStorage.setItem('user', JSON.stringify(parsed));

    }

    updatePublicBlocks(){
        axios.get('http://localhost:4001/blockinfochain/')
            .then(response => {
                if (this._isMounted) {
                    let cpData = response.data;
                    cpData.reverse();
                    this.setState({slicePublicBetList:cpData,publicBetList: cpData});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    componentDidMount() {
        //todo filter non public?
        this._isMounted = true;
        this.updatePublicBlocks();

    }

    componentWillUnmount () {
        this._isMounted = false;
        this.updateLocalStorageUser();
    }


    handlePublicChange = (e) =>{
        this.setState({searchInput: e.target.value},() =>
            this.updatePublicSearch());
    };

    updatePublicSearch() {
        var my_filter = this.state.searchInput.toUpperCase();
        this.setState({slicePublicBetList: this.state.publicBetList.filter((value)=>{
                return (this.prettifyItem(value) + value.summary).toUpperCase().indexOf(my_filter) !== -1;
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

    acceptFriendRequest(friend_user_name) {
        // Post to this user's entry in DB: Delete friend_user_name from incoming and add to current friends
        // Post to friend_user_name's entry in DB: Delete friend_user_name from outgoing and add to current friends

        const obj = {
            user_name_incoming: this.state.user_name,
            user_name_outgoing: friend_user_name
        };

        axios.post('http://localhost:4002/credentials/acceptFriendRequest/' + this.state.user_name, obj)
            .then(temp => {
                axios.post('http://localhost:4002/credentials/acceptOtherEndFriendRequest/' + this.state.user_name, obj)
                    .then(res => {
                        // Remove from the current friend requests
                        let remReqList = this.state.user_friends_requests_incoming.slice();
                        var index = remReqList.indexOf(friend_user_name);
                        if (index > -1) {
                            remReqList.splice(index, 1);
                        }

                        // Add the new friend
                        let friendList = this.state.user_list_current_friends.slice();
                        friendList.push(friend_user_name);

                        this.setState({
                            user_list_current_friends: friendList,
                            user_friends_requests_incoming: remReqList
                        });
                    });
            });

    }
    // RenderFriendRequestList2(lo_item) {
    //     const listItems = lo_item.map((item, idx) =>
    //
    //
    //
    //             <div className="toast__container">
    //                 <div className="toast__cell">
    //                     <div className="toast toast--green">
    //                         <div className="toast__icon">
    //
    //                         </div>
    //                         <div className="toast__content">
    //                             <p className="toast__type">{item} added you as a friend <li onClick={()=> {this.acceptFriendRequest(item)}} className="" key={idx}>Accept</li></p>
    //                             <p className="toast__message">Don't worry, we won't notify them if you don't accept.</p>
    //                         </div>
    //                         <button className="toast__close">
    //                             X
    //                         </button>
    //                     </div>
    //
    //                 </div>
    //             </div>
    //
    //     );
    //     return (
    //         <nav>
    //             <ul className={'friendList'}>{listItems}</ul>
    //         </nav>
    //     );
    // }
    RenderFriendRequestList(lo_item) {
        const listItems = lo_item.map((item, idx) =>

            <div key={idx} onClick={()=> {this.acceptFriendRequest(item)}} className="card2">
                <div key={idx} className={'customItem'}>{item}</div>
            </div>


        );
        return (
            <div className="scrolling-wrapper-flexbox">
                {listItems}
            </div>
        );
    }



    // Sends the selected user a friend request and updates the recommended friends to no longer show this friend.
    addSelectedUserAsFriend(selectedUser){

        var copyOfRecFriends = this.state.user_list_recommended_friends.slice();
        var index = copyOfRecFriends.indexOf(selectedUser.toString());
        if (index > -1) {
            copyOfRecFriends.splice(index, 1);
        }

        var copyOfFriendRequestsOutgoing = this.state.user_friends_requests_outgoing.slice();
        copyOfFriendRequestsOutgoing.push(selectedUser);

//

        const obj = {
            user_list_recommended_friends: copyOfRecFriends,
            user_friends_requests_outgoing:copyOfFriendRequestsOutgoing,
            user_name:this.state.user_name
        };

        const otherUserIncomingFriendReq = {
            user_name:selectedUser,
            user_name_to_add: this.state.user_name
        };

        axios.post('http://localhost:4002/credentials/update/'+this.state.user_name, obj)
            .then(res => {
                this.setState({user_list_recommended_friends:copyOfRecFriends,user_friends_requests_outgoing:copyOfFriendRequestsOutgoing});
                axios.post('http://localhost:4002/credentials/updateFriendRequestReceiver/'+selectedUser, otherUserIncomingFriendReq);
            });

    }

    RenderRecFriendList(lo_item) {
        const listItems = lo_item.map((item, idx) =>
                <div key={idx} onClick={()=> {this.addSelectedUserAsFriend(item)}} className="card1">
                    <div key={idx} className={'customItem'}>{item}</div>
                </div>


        );
        return (
            <div className="scrolling-wrapper">
                {listItems}
            </div>
        );
    }

    blockLink(){
        return(<Redirect to={{
            pathname: '/joinBlock',
            state: {
                user1:this.state.selected_user1,
                agreement:this.state.selected_agreement,
                summary:this.state.selected_summary,
                outcomes:this.state.selected_outcomes,
                completion_date:this.state.selected_completion_date,
                block_id:this.state.selected_block_id
            }
        }}
        />)
    }

    blockLinkRedirect(item){
        this.setState({
            redirect:true,
            selected_user1:item.user1,
            selected_agreement:item.agreement,
            selected_summary:item.summary,
            selected_outcomes:item.outcomes,
            selected_completion_date:item.completion_date,
            selected_block_id:item._id
        });
    }

    prettifyAgreement(agreement){
        let ag = JSON.parse(agreement);
        let p ='Paper';
        if(ag.agreement_is_paper==='false'){p=''}
        return ag.agreement_condition + ' $' + ag.agreement_amount +' ' + p
    }

    prettifyItem(item){
        return item.user1 + ' - ' + this.prettifyAgreement(item.agreement) + ' ' + item.completion_date + ' - Public';
    }

    RenderBetList(lo_item) {
        const listItems = lo_item.map((item, idx) =>
            <div key={idx}>
                <h4 onClick={()=>{this.blockLinkRedirect(item)}} key={idx} className="w3-text-grey" style={{cursor:'pointer',fontSize: 28}}>{this.prettifyItem(item)}</h4><br/>
                <p className="w3-text-grey" style={{fontSize: 20}}>{item.summary}</p><br/>
            </div>

        );

        return (
            <div>
                <div style={{ display: "flex"}}>
                    <h1 style={{paddingBottom:5}} className="">Public Blocks</h1><br/>

                    <div className="search">
                        <div className={'searchDiv'}>
                            <input type="text" name="searchInput" className="search-input"
                                   onChange={this.handlePublicChange}
                                   placeholder="       Browse public blocks..."/>
                        </div>
                    </div>

                </div>
            <nav>
                <div  className="w3-row w3-padding-64" id="Examples">
                    <div  className="w3-col l6 w3-padding-large">
                        <div >{listItems}</div>
                    </div>
                </div>
            </nav>


            </div>
        );
    }


    render() {
        return (
            <div>
                {this.state.redirect ?
                    (<Redirect to={{
                        pathname: '/joinBlock',
                        state: {
                            user1: this.state.selected_user1,
                            agreement: this.state.selected_agreement,
                            summary: this.state.selected_summary,
                            outcomes: this.state.selected_outcomes,
                            completion_date: this.state.selected_completion_date,
                            block_id:this.state.selected_block_id
                        }
                    }}
                    />) :
                    (
                        <div>{linkBar()}

                            <ul style={{display:'flex'}}>
                                {this.RenderBetList(this.state.slicePublicBetList)}
                                <div className="w3-col l6 w3-padding-large">
                                    <img  src={logo2} className="myImg" alt="Menu"/>
                                </div>

                            </ul>


                            <div>
                                <section className="content">

                                    <h1 style={{paddingLeft:30,paddingTop:40,paddingBottom:20}}> Recommended Friends</h1>
                                    {this.RenderRecFriendList(this.state.user_list_recommended_friends)}

                                    <h1 style={{paddingLeft:30,paddingTop:50,paddingBottom:20}}>Incoming Friend Requests</h1>
                                    {this.RenderFriendRequestList(this.state.user_friends_requests_incoming)}

                                </section>
                            </div>


                            {/*<b>Friend Requests</b>*/}
                            {/*<ul>{this.RenderFriendRequestList(this.state.user_friends_requests_incoming)}</ul>*/}

                            {/*<b>Recommended Friends</b>*/}
                            {/*<ul>{this.RenderRecFriendList(this.state.user_list_recommended_friends)}</ul>*/}




                        </div>
                    )
                }
            </div>
                )
    }
}