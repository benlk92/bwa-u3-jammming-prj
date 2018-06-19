import React, { Component } from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults'
import SearchBar from '../SearchBar/SearchBar'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends Component {

  constructor(props){
    super(props);
    this.state = {searchResults: [],
                  playlistTracks: [],
                  playlistName: "My Playlist"};
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  
  addTrack(track){
    const curTracks = this.state.playlistTracks;

    let shouldAdd = true;
    curTracks.forEach(function(curTrack) {
      if (curTrack.id === track.id){  
        shouldAdd = false;
      }
    });

    if (shouldAdd) {curTracks.push(track)}; 


    this.setState({playlistTracks: curTracks}); 

  };

  removeTrack(track){
    const curTracks = this.state.playlistTracks.filter(curTrack => (curTrack.id !== track.id));
    this.setState({playlistTracks: curTracks});
  };

  updatePlaylistName(newName){
    this.setState({playlistName: newName});
  }

  savePlaylist(){
    const playlistTracks = this.state.playlistTracks
    const trackURIs = playlistTracks.map(curTrack => curTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({playlistName: "My Playlist", playlistTracks: []});
    });
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(tracks => {
      this.setState({searchResults:tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


