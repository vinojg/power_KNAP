import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import SearchResults from './SearchResults';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      query: '',
    };
    this.updateQuery = this.updateQuery.bind(this);
    this.search = _.debounce(this.search.bind(this), 500);
  }

  updateQuery(event) {
    const pressedEnter = event.key === 'Enter';
    Promise.resolve(this.setState({
      query: event.target.value,
    }))
      .then(() => pressedEnter ? this.search.flush() : this.search())
      .catch(err => console.error('Failed to search for query: ', err));
  }

  // send query to server via roomSocket connection
  search() {
    axios.get(`/search?query=${this.state.query}`)
      .then(videos => this.setState({ searchResults: videos.data.items }))
      .catch(err => console.error('Failed to get videos: ', err));
  }

  render() {
    return (
      <div className="container search">
        <SearchResults
          searchResults={this.state.searchResults}
          saveToPlaylist={this.props.saveToPlaylist}
        />
        <div className="container searchbar" >
          <input placeholder="Search for a video" onKeyUp={this.updateQuery} />
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  saveToPlaylist: PropTypes.func.isRequired,
};

export default Search;
