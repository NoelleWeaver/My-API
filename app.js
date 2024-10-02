const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


let bands = require('./data.json');
let albums = require('./data2.json');


const password = "admin";


app.get('/', (req, res) => {
    res.send('<h1>Welcome to Bands and their Albums API</h1>');
});

app.get('/api/band', (req,res) =>{
    const newBands = bands.map(band =>{
        const {id, name, formed} = band
        return {id, name, formed}
    })
    res.json(newBands)
})

app.get('/api/bands/:bandID', (req,res) => {
    console.log(req.query)
    const {bandID} = req.params
    const singleband = bands.find(band => band.id === Number(bandID))

    if(!singleband){
        return res.status(404).send('Band does not exist')
    }
    return res.json(singleband)
})


app.get('/api/albums', (req,res) =>{
    const newAlbums= albums.map(album =>{
        const {id, title, band_id, released} = album
        return {id, title, band_id, released}
    })
    res.json(newAlbums)
})

app.get('/api/albums/:albumID', (req,res) => {
    console.log(req.query)
    const {albumID} = req.params
    const singlealbum = albums.find(album => album.id === Number(albumID))

    if(!singlealbum){
        return res.status(404).send('Album does not exist')
    }
    return res.json(singlealbum)
})

app.get('/api/bands/add/:name/:formed/:pass', (req,res) =>{
    const { name, formed, pass} = req.params
    if(pass !== password){
        res.redirect('/')
    }

    const newBand = { id: bands.length + 1, name, formed}
    bands.push(newBand)
    fs.writeFileSync('.data.json', JSON.stringify(bands, null, 4))

    res.status(200).json(newBand)
})

app.get('/api/songs/add/:title/:game_id/:song_level/:token', (req, res) => {
    const { title, game_id, song_level, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const newSong = { id: songs.length + 1, title, game_id: parseInt(game_id), song_level: parseInt(song_level) };
    songs.push(newSong);
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));

    res.status(201).json(newSong);
});


app.get('/api/rhythmgames/:id/delete/:token', (req, res) => {
    const { id, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    rhythmGames = rhythmGames.filter(game => game.id !== Number(id));
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));

    res.status(204).send('Deleted successfully');
});


app.get('/api/songs/:id/delete/:token', (req, res) => {
    const { id, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    songs = songs.filter(song => song.id !== Number(id));
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));

    res.status(204).send('Deleted successfully');
});


app.get('/api/rhythmgames/:id/update/:name/:company/:token', (req, res) => {
    const { id, name, company, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const gameIndex = rhythmGames.findIndex(game => game.id === Number(id));

    if (gameIndex === -1) {
        return res.status(404).json({ message: 'Rhythm game not found' });
    }

    rhythmGames[gameIndex] = { id: Number(id), name, company };
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));

    res.json(rhythmGames[gameIndex]);
});


app.get('/api/songs/:id/update/:title/:game_id/:song_level/:token', (req, res) => {
    const { id, title, game_id, song_level, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const songIndex = songs.findIndex(song => song.id === Number(id));

    if (songIndex === -1) {
        return res.status(404).json({ message: 'Song not found' });
    }

    songs[songIndex] = { id: Number(id), title, game_id: parseInt(game_id), song_level: parseInt(song_level) };
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));

    res.json(songs[songIndex]);
});

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
