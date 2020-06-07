import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../../utils/storage";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "",
      signUpError: "",
      signInError: "",
      masterError: "",
      signInEmail: "",
      signInPassword: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpFirstName: "",
      signUpLastName: ""
    };
    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(
      this
    );
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(
      this
    );
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(
      this
    );
    this.onTextBoxChangeSignUpFirstName = this.onTextBoxChangeSignUpFirstName.bind(
      this
    );
    this.onTextBoxChangeSignUpLastName = this.onTextBoxChangeSignUpLastName.bind(
      this
    );
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(
      this
    );
  }

  componentDidMount() {
    const token = getFromStorage("the_main_app");
    if (!token) {
      //VERIFY TOKEN
      fetch("/api/account/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onTextBoxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextBoxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }

  onTextBoxChangeSignInPassword(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextBoxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value
    });
  }

  onTextBoxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value
    });
  }

  onTextBoxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }

  newCounter() {
    // fetch('/api/counters', { method: 'POST' })
    //   .then(res => res.json())
    //   .then(json => {
    //     let data = this.state.counters;
    //     data.push(json);
    //     this.setState({
    //       counters: data
    //     });
    //   });
  }

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (token) {
      console.log("enter");
      return (
        <>
          <div>
            {" "}
            {signInError ? <p>{signInError}</p> : null}
            <p>Sign In</p>
            <label>Email:</label>
            <input type="email" placeholder="Email" value={signInEmail} onChange={this.onTextBoxChangeSignInEmail}></input>
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextBoxChangeSignInPassword}
            ></input>
            <br />
            <button>Sign In</button>
          </div>
          <br /> <br />
          <div>
            <p>Sign Up</p>
            <label>Email:</label>
            <input
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onTextBoxChangeSignUpFirstName}
            ></input>
            <br />
            <input
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onTextBoxChangeSignUpLastName}
            ></input>
            <br />
            <input type="email" placeholder="Email" value={signUpEmail}></input>
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextBoxChangeSignUpPassword}
            ></input>
            <br />
            <button>Sign Up</button>
          </div>
        </>
      );
    }

    return (
      <div>
        <p>Account</p>
      </div>
    );
  }
}

export default Home;
