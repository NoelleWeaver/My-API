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
    res.send('Rock API');
});

app.get('/api/bands', (req,res) =>{
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
    fs.writeFileSync('data.json', JSON.stringify(bands, null, 4))

    res.status(200).json(newBand)
})

app.get('/api/albums/add/:title/:band_id/:released/:pass', (req, res) => {
    const { title, band_id, released, pass } = req.params;

    if (pass !== password) {
        return res.redirect('/')
    }

    const newAlbum = { id: albums.length + 1, title, band_id: parseInt(band_id), released: parseInt(released) };
    albums.push(newAlbum);
    fs.writeFileSync('data2.json', JSON.stringify(albums, null, 4));

    res.status(201).json(newAlbum);
});


app.get('/api/bands/:id/delete/:pass', (req, res) => {
    const { id, pass } = req.params;

    if (pass !== password) {
        return res.redirect('/')
    }

    bands = bands.filter(game => game.id !== Number(id));
    fs.writeFileSync('/bands.json', JSON.stringify(bands, null, 4));

    res.status(204).send('Deleted');
});


app.get('/api/albums/:id/delete/:pass', (req, res) => {
    const { id, pass } = req.params;

    if (pass !== password) {
        return res.redirect('/')
    }

    albums = albums.filter(album => album.id !== Number(id));
    fs.writeFileSync('/data2.json', JSON.stringify(albums, null, 4));

    res.status(204).send('Deleted');
});


app.get('/api/bands/:id/update/:name/:formed/:pass', (req, res) => {
    const { id, name, formed, pass } = req.params;

    if (pass !== password) {
        return res.redirect('/')
    }

    const bandIndex = bands.findIndex(band => band.id === Number(id));

    if (bandIndex === -1) {
        return res.status(404).json({ message: 'Band not found' });
    }

    bands[bandIndex] = { id: Number(id), name, formed };
    fs.writeFileSync('/data.json', JSON.stringify(bands, null, 4));

    res.json(bands[bandIndex]);
});


app.get('/api/albums/:id/update/:title/:band_id/:released/:pass', (req, res) => {
    const { id, title, band_id, released, pass } = req.params;

    if (pass !== password) {
        return res.redirect('/')
    }

    const albumIndex = albums.findIndex(album => album.id === Number(id));

    if (albumIndex === -1) {
        return res.status(404).json({ message: 'Album not found' });
    }

    albums[albumIndex] = { id: Number(id), title, band_id: parseInt(band_id), released: parseInt(released) };
    fs.writeFileSync('/data2.json', JSON.stringify(albums, null, 4));

    res.json(albums[albumIndex]);
});

app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
