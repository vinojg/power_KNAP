import React from 'react';
import cookie from 'cookie';
import CreateModal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    overflowY             : 'auto',
  }
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null, // refers to Google username when logged in in chat
      createModalIsOpen: false,
    }
  }

  componentDidMount() {
    if (cookie.parse(document.cookie).user) {
      console.log(cookie.parse(document.cookie));
      this.setState({ user: cookie.parse(document.cookie).user })
    }
    this.openCreateModal();
  }

  openCreateModal() {
    this.setState({createModalIsOpen: true});
  }

  afterOpenCreateModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#000';
  }

  closeCreateModal() {
    this.setState({createModalIsOpen: false});
  }

  render() {
    const view = this.state.user ?
      <ul>
        <li className="nav-link"><a href="#">Create a Room</a></li>
        <li className="nav-link" onClick={ () => this.props.getUser(this.state.user) }><a href="#">{this.state.user}</a></li>
        <li className="nav-link" href="/auth/logout"><a href="#">Logout</a></li>
      </ul> :
      <li className="nav-link"><a href="/auth/google">Login</a></li>;

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
          <CreateModal
            isOpen={this.state.createModalIsOpen}
            onAfterOpen={this.afterOpenCreateModal}
            onRequestClose={this.closeCreateModal}
            style={customStyles}
            >
            <h2 ref={subtitle => this.subtitle = subtitle}>Create a Room</h2>
          </CreateModal>
        </header>
    );
  }
}

export default NavBar;
