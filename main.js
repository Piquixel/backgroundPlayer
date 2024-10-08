window.onload = () => {
	document
		.querySelector(':root')
		.style.setProperty(
			'--random-degree',
			Math.round(Math.random() * 360) + 'deg'
		);
};

const colorThief = new ColorThief();
const img = new Image();

const song = document.getElementById('song'),
	artist = document.getElementById('artist'),
	album = document.getElementById('album');

const blurs = document.querySelectorAll('.blurImage');

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

	if (!listening_to_spotify | (currentTrack === spotify.track_id)) return;
	currentTrack = spotify.track_id;

	const values = new Date(Date.now() - spotify.timestamps.start);
	const components = values.getMinutes() * 60 + values.getSeconds();
	const totalBase = new Date(
		spotify.timestamps.end - spotify.timestamps.start
	);
	const total = totalBase.getMinutes() * 60 + totalBase.getSeconds();
	percent = Math.ceil((components / total) * 100);

	document
		.querySelector(':root')
		.style.setProperty('--progress', total - components + 's');

	document
		.querySelector(':root')
		.style.setProperty('--percent', percent + '%');

	document.querySelector('#progress-bar span:last-child').animate(
		{
			transform: [`scaleX(${percent}%)`, 'scaleX(100%)'],
		},
		{
			fill: 'forwards',
			easing: 'linear',
			duration: (total - components) * 1000,
			iterations: 1,
		}
	);

	img.addEventListener('load', () => {
		document
			.querySelector(':root')
			.style.setProperty(
				'--cover-primary-color',
				`rgb(${colorThief.getColor(img).join(',')})`
			);

		document.querySelector(':root').style.setProperty(
			'--some-other',
			`rgb(${colorThief
				.getColor(img)
				.map((c) => 255 - c)
				.join(', ')})`
		);

		document
			.querySelector(':root')
			.style.setProperty(
				'--cover-url',
				`url('${spotify.album_art_url}')`
			);
	});

	img.crossOrigin = 'Anonymous';
	img.src = spotify.album_art_url;

	document.querySelector('#cover').src = spotify.album_art_url;

	// for (const image of blurs) {
	// 	image.src = spotify.album_art_url;
	// }

	song.textContent = spotify.song;
	artist.textContent = spotify.artist;
	album.textContent = spotify.album;
};

getSpotifyActivity();

setInterval(getSpotifyActivity, 5000);
