import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

const SearchResultsEntry = ({ searchResult, saveToPlaylist }) => (
  <div className="searchEntry">
    <img
      alt={searchResult.snippet.title}
      src={searchResult.snippet.thumbnails.default.url}
      onClick={() => saveToPlaylist(searchResult)}
    />
    <div className="entryDetails">
      <div className="resultTitle" onClick={() => { saveToPlaylist(searchResult); }}>
        {searchResult.snippet.title}
      </div>
      <div className="resultDescription">{searchResult.snippet.description}</div>
    </div>
    <button id="plus" onClick={() => saveToPlaylist(searchResult)}>+</button>
  </div>
);

SearchResultsEntry.propTypes = {
  searchResult: PropTypes.object.isRequired,
  saveToPlaylist: PropTypes.func.isRequired,
};

export default SearchResultsEntry;
