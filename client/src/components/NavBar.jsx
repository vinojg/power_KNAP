import React from 'react';
import cookie from 'cookie';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null // refers to Google username when logged in in chat
    }
  }

  componentDidMount() {
    if (cookie.parse(document.cookie).user) {
      console.log(cookie.parse(document.cookie));
      this.setState({ user: cookie.parse(document.cookie).user })
    }
  }

  render() {
    const view = this.state.user ?
      <span className="nav-link">Welcome, {this.state.user} <a className="nav-link" href="/auth/logout">Logout</a></span> :
      <span className="nav-link"><a href="/auth/google">Login</a></span>;

    return (
        <header>
          <div className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between">
              <a href="/" className="navbar-brand">fam.ly</a>
              <nav>
                {view}
              </nav>
            </div>
          </div>
        </header>
    );
  }
}

export default NavBar;
