import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import RoomList from './components/RoomList';
import Modal from 'react-modal';
import NavBar from './components/NavBar';
import Messages from './components/Messages';
import RoomView from './components/RoomView';
import Home from './components/Home';
import RoomListEntry from './components/RoomListEntry';
import UserProfile from './components/UserProfile';

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


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roomList: [1, 2, 3],
      roomBeingViewed: 1,
      modalIsOpen: false,
      view: 'home',
      user: {},
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderView = this.renderView.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  componentDidMount() {
    this.setState({
      view: 'home'
    });

    // this.getUser('Rithnarin');
  }

  getUser(user) {
    fetch(`/users?user=${user}`)
      .then(response => response.json())
      .then(user => this.setState({
        user: user,
      }))
      .catch(err => console.error(err));
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#000';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  renderView() {
    const {view} = this.state;

    if (view === 'home') {
      return <Home openModal={this.openModal} />;
    } else if (view === 'room') {
      return <RoomView roomId={this.state.roomBeingViewed}/>;
    } else if (view === 'user') {
      return <UserProfile user={this.state.user} />;
    }
  }

  changeView(view) {
    this.setState({
      view: view,
    });
    // axios.get('/rooms')
    //   .then(({ data }) => this.setState({ roomList: data.rooms }));
  }


  // note: must somehow pass room id to selected room as prop!!

  render() {
    return (
      <div>
        <NavBar />
        { this.renderView() }

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          >
          <h2 ref={subtitle => this.subtitle = subtitle}>Select Room</h2>
          <RoomList rooms={this.state.roomList} changeView={this.changeView} />
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
