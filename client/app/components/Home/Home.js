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

    this.setState({ isLoading: true });
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
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage("the_main_app");
  

    if (obj && obj.token) {
      const { token } = obj;
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
      signInPassword: event.target.value
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

  onSignIn() {
    // grab state
    const { signInEmail, signInPassword } = this.state;
    // post request to backend
    fetch("/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('the_main_app', {token: json.token})
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: "",
            signInPassword: "",
            token: json.token
          });
        } else {
          this.setState({ signInError: json.message, isLoading: false });
        }
      });
  }

  onSignUp() {
    //grab state
    const {
      signUpEmail,
      signUpFirstName,
      signUpLastName,
      signUpPassword
    } = this.state;
    // post request to backend
    fetch("/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpFirstName: "",
            signUpLastName: "",
            signUpPassword: ""
          });
        } else {
          this.setState({ signUpError: json.message, isLoading: false });
        }
      });
  }

  render() {
    const {
      isLoading,
      token,
      signUpError,
      signInError,
      masterError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (!token) {
      console.log("enter");
      return (
        <>
          <div>
            {" "}
            {signInError ? <p>{signInError}</p> : `Signed IN`}
            <p>Sign In</p>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextBoxChangeSignInEmail}
            ></input>
            <br />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextBoxChangeSignInPassword}
            ></input>
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br /> <br />
          <div>
            {signUpError ? <p>{signUpError}</p> : `Signed Up`}
            <p>Sign Up</p>
            <label>First Name:</label>
            <input
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onTextBoxChangeSignUpFirstName}
            ></input>
            <br />
            <label>Last Name :</label>
            <input
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onTextBoxChangeSignUpLastName}
            ></input>
            <br />
            <label>Email:</label>
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextBoxChangeSignUpEmail}
            ></input>
            <br />
            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextBoxChangeSignUpPassword}
            ></input>
            <br />
            <button onClick={this.onSignUp}>Sign Up</button>
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
