let userAccessToken = ""
const clientID = '761d6e953535473cbb1c8583b3a14c3b'
const redirectURL = 'http://localhost:3000/'

const Spotify = {
	getAccessToken(){
		if (userAccessToken){
			return userAccessToken;
		}

		const url = window.location.href;

		const accessToken = url.match(/access_token=([^&]*)/);
		const expiresIn = url.match(/expires_in=([^&]*)/);

		if (accessToken && expiresIn) 
		{
			userAccessToken = accessToken[1];
			const expirationTime = Number(expiresIn[1]) * 1000;
		

			window.setTimeout(() => userAccessToken = '', expirationTime);
			window.history.pushState('For Access Token', null, '/');

		return userAccessToken;

		}

		else 
		{
		window.location.href = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURL;
		}
	},

	search(term){

		const accessToken = this.getAccessToken();

		const searchUrl = 'https://api.spotify.com/v1/search?type=track&q=' + term;

		return fetch(searchUrl, {
			headers: {
				Authorization: "Bearer " + accessToken
				}
			}
		)
		.then(response => response.json())
		.then(jsonResponse => {
			if (!jsonResponse.tracks){
				return [];
			}

			return jsonResponse.tracks.items.map(curTrack => {
				return {
					id: curTrack.id,
					name: curTrack.name,
					artist: curTrack.artists[0].name,
					album: curTrack.album.name,
					uri: curTrack.uri
				}
			})
		})
	},

	savePlaylist(playlistName, trackURIs){
		if (!playlistName || !trackURIs){
			return
		}


		const accessToken = this.getAccessToken();

		return fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: "Bearer " + accessToken
			}
		})
		.then(response => response.json())
		.then(jsonResponse => jsonResponse.id)
		.then(userId => {
			fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
			headers: {
				Authorization: "Bearer " + accessToken
			},
			body: JSON.stringify({name: playlistName}),
			method: 'POST'
			})
		.then(response => response.json())
		.then(jsonResponse => {
			const playlistId = jsonResponse.id;
			const addSongUrl = `https://api.spotify.com/v1/users/&{userId}/playlists/${playlistId}/tracks`;
		fetch(addSongUrl, {
			headers: {
				Authorization: "Bearer " + accessToken
			},
			body: JSON.stringify({uris: trackURIs}),
			method: 'POST'
			});
		});
	});
}
}



export default Spotify;
