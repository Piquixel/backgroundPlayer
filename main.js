const colorThief = new ColorThief();
const img = new Image();

const song = document.getElementById('song'),
	artist = document.getElementById('artist'),
	album = document.getElementById('album');

const API_URL = 'https://api.lanyard.rest/v1';
const USER_ID = '383187323963047936';

const fetchResponse = async (userId) => {
	try {
		return await fetch(`${API_URL}/users/${userId}`).then((res) =>
			res.json()
		);
	} catch (err) {
		console.error(err);
	}
};

let currentTrack, percent;

const getSpotifyActivity = async () => {
	const {
		data: { listening_to_spotify, spotify },
	} = await fetchResponse(USER_ID);

	if (!listening_to_spotify) return;

	const values = new Date(Date.now() - spotify.timestamps.start);
	const components = values.getMinutes() * 60 + values.getSeconds();
	const totalBase = new Date(
		spotify.timestamps.end - spotify.timestamps.start
	);
	const total = totalBase.getMinutes() * 60 + totalBase.getSeconds();
	percent = Math.ceil((components / total) * 100);

	document
		.querySelector(':root')
		.style.setProperty('--progress', percent + '%');

	if (currentTrack === spotify.track_id) return;

	img.addEventListener('load', () => {
		document
			.querySelector(':root')
			.style.setProperty(
				'--cover-primary-color',
				`rgb(${colorThief.getPalette(img)[0].join(',')})`
			);

		document
			.querySelector(':root')
			.style.setProperty(
				'--some-other',
				`rgb(${colorThief.getColor(img).join(',')})`
			);
	});

	img.crossOrigin = 'Anonymous';
	img.src = spotify.album_art_url;

	document.querySelector('#cover').src = spotify.album_art_url;
	// document.querySelector('#background').src = spotify.album_art_url;

	song.textContent = spotify.song;
	artist.textContent = spotify.artist;
	album.textContent = spotify.album;

	getSpotifyActivity();
};

getSpotifyActivity();
