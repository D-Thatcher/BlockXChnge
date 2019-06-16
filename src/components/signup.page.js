import React, {Component} from 'react';
import './signup.css';
import {LO_QUESTION,LO_ANSWER,APP_NAME,WHAT_IS_XCHNG,PRIVACY,WHAT_IS_XCHNG_FOLLOW, SLOGAN,DESCRIBE_SLOGAN_1,DESCRIBE_SLOGAN_2, UNACCOUNTED_FOR_1,UNACCOUNTED_FOR_2} from '../CONSTANTS';
import Signup from "./signup.component";
import logo from '../2231.PNG';
import './signUpPageFAQ.css';


const renderQAList = props =>(
    <ul className='FAQList'>
        {props.question_list.map(function(d, idx){
            return (
                <div>
                    <li onClick={() => props.onClick} className='FAQItem' key={idx}>{d}</li>
                    <li>{this.state.question_answer[idx] ? LO_ANSWER[idx]:''}</li>
                </div>
            )
        })}
    </ul>
);




export default class SignupPage extends Component {

    constructor(props) {
        super(props);

        this.state = {question_answer:new Array(LO_QUESTION.length).fill(0)};
        this.underlineStyle =  {
            textDecoration: 'underline'
        };
        this.signUpLinkStyle =  {
            textDecoration: 'underline',
            color:'black',
            backgroundColor :'white',
            float:'right'
        };
        this.contactStyle = {listStyle: 'none'};
        this.mailStyle = {listStyle: 'none',cursor: 'pointer'};

        this.openMail = this.openMail.bind(this);
        this.email = "help@"+ APP_NAME.toString().toLowerCase()+".com";
        this.updateI = this.updateI.bind(this);
    }
    openMail(){
        window.open('mailto:'+this.email);
    }

    renderQA(i){
        return(<li className='FAQItem' key={i} onClick={() => this.updateI(i)}  >
            <div key={i}>{LO_QUESTION[i]}</div>
            <div className="FAQItemChild">{this.state.question_answer[i] ? LO_ANSWER[i]: ''}</div>
        </li>)
    }

    updateI(i){
        let newArr = this.state.question_answer.slice();
        newArr[i] = !newArr[i];
        this.setState({question_answer : newArr});
    }


    render() {
        return (
            <div>
                {/*<title>W3.CSS Template</title>*/}
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                {/*<body>*/}
                <div className="w3-top">
                    <div className="w3-bar w3-white w3-padding w3-card">
                        <a href="#signup" className="w3-bar-item w3-button">{APP_NAME}</a>
                        <div className="w3-right w3-hide-small">
                            <a href="#about" className="w3-bar-item w3-button">About</a>
                            <a href="#Examples" className="w3-bar-item w3-button">Examples</a>
                            <a href="#faq" className="w3-bar-item w3-button">Common Questions</a>
                            <a href="#privacy" className="w3-bar-item w3-button">Privacy</a>
                            <a href="#contact" className="w3-bar-item w3-button">Contact</a>

                        </div>
                    </div>
                </div>

                <div className='plainSpace' id="signup">
                <header className="w3-display-container w3-content w3-wide">
                    {/*<img className="w3-image" src={plainWhite} alt="Hamburger Catering" width="800" height="400"/>*/}
                    <div className="w3-display-middle">
                    <Signup/>
                    </div>
                    <div className="w3-display-bottomleft w3-padding-large w3-opacity">


                    </div>
                </header>
                </div>
                <h1 className="w3-xxlarge">{SLOGAN}</h1>

                <div className="w3-content" >

                    <div className="w3-row w3-padding-64" id="about">
                        <div className="w3-col m6 w3-padding-large w3-hide-small">
                            <img src={logo} className="w3-round w3-image w3-opacity-min" alt="Table Setting" width="600" height="750"/>
                        </div>

                        <div className="w3-col m6 w3-padding-large">
                            <h1 className="w3-center">What is a Block Exchange?</h1><br/>
                            <h5 className="w3-center">{SLOGAN}</h5>
                            <p className="w3-large">a <span className="w3-tag w3-light-grey">Block Exchange</span>{WHAT_IS_XCHNG}</p>
                            <p className="w3-large"><span className="w3-tag w3-light-grey">{APP_NAME}</span>{WHAT_IS_XCHNG_FOLLOW}</p>
                            <p className="w3-large">{DESCRIBE_SLOGAN_1}<span className="w3-tag w3-light-grey">{SLOGAN}</span>{DESCRIBE_SLOGAN_2}</p>
                            <p className="w3-large">{UNACCOUNTED_FOR_1}<a className="w3-tag w3-light-grey" style={this.underlineStyle} href="#Examples">Example</a>{UNACCOUNTED_FOR_2}</p>


                            <a className="w3-tag" style={this.signUpLinkStyle} href="#signup">Ready to Sign Up?</a>

                        </div>
                    </div>

                    <hr/>

                    <div className="w3-row w3-padding-64" id="Examples">
                        <div className="w3-col l6 w3-padding-large">

                            <h1 className="w3-center">Block Examples</h1><br/>
                            <h4>UserA- $10.50 USD 29/05/2019 -UserB</h4>
                            <p className="w3-text-grey">UserA Will Win $10.50 if the Raptors beat the Bulls played in Roger's Place on 29/05/2019 local time</p><br/>

                            <h4>UserB- $7.80 USD 18/12/2018 -UserC</h4>
                            <p className="w3-text-grey">UserB Will Win $7.80 if Apple's (AAPL) stock price meets or exceeds $383 on or before 18/12/2018 UTC</p><br/>

                            <h4>UserD- $80.00 USD 01/11/2018 -UserG</h4>
                            <p className="w3-text-grey">UserB Will Win $80.00 if it snows in New York City, NY USA on 01/11/2018 local time</p><br/>

                            <h4>UserX- $8400.00 USD 01/11/2018 -UserY</h4>
                            <p className="w3-text-grey">This deal's summary is marked Private</p><br/>

                            <h4>UserG- $765.00 USD 01/11/2018 -UserK</h4>
                            <p className="w3-text-grey">UserB Will Win $765.00 if $1.00 USD is valued at $1.50 CAD on 02/02/2018 UTC</p><br/>

                            <h4>UserW- $100.00 USD 01/01/2020 -UserA</h4>
                            <p className="w3-text-grey">UserW Will Win $100.00 USD if the price of one 10-Year U.S. government bond is less than $100 on 01/01/2020 UTC</p><br/>
                            <a className="w3-tag" style={this.signUpLinkStyle} href="#signup">Want to Add the Next Block?</a>
                        </div>

                        <div className="w3-col l6 w3-padding-large">
                            <img src={logo} className="w3-round w3-image w3-opacity-min" alt="Menu"/>
                        </div>
                    </div>

                    <hr/>

                    <div className="w3-container w3-padding-64" id="faq">
                        {/*<h2 className='w3-large'>*/}
                            <h1 className='FAQHeader'>Common Questions</h1>
                            <nav>
                            <ul className='FAQList'>

                                {LO_QUESTION.map((item,idx)=>{
                                    return (
                                        this.renderQA(idx)
                                    )
                                })}


                            </ul>
                            </nav>
                        {/*</h2>*/}

                    </div>



                    <hr/>

                    <div className="w3-container w3-padding-64" id="privacy">
                        <h1>Privacy</h1><br/>
                        <p>{PRIVACY}</p>
                    </div>


                </div>

                <footer className="w3-center w3-light-grey w3-padding-32" id='contact'>
                    <li style={this.contactStyle}> Have Any Questions? Email us at <b onClick={this.openMail} style={this.mailStyle}>{this.email}</b></li>
                    {/*todo make img of email*/}
                </footer>

                {/*</body>*/}
            </div>
        )
    }
};

