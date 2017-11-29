import React from 'react';
import ReactDOM from 'react-dom';
import RoomList from './components/RoomList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomList: ['Room1', 'Room2', 'Room3'],
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="room">
        <h1>Fam.ly</h1>
        <RoomList rooms={this.state.roomList} />

      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

