import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
	constructor(props){
		super(props);
		this.handleTermChange = this.handleTermChange.bind(this);
		this.search = this.search.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		}

	search(){
		this.props.onSearch(this.state.searchTerm);
	}

	handleTermChange(event){
		this.setState({searchTerm:event.target.value});
	}

	handleKeyPress(event){
		if (event.key === "Enter") {
			this.search();
		}
	}

  render() {
    return (
		<div className="SearchBar">
		  <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.handleKeyPress}/>
		  <a onClick={this.search} >SEARCH</a>
		</div>
    );
  }
}

export default SearchBar;