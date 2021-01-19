require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;
const SpotifyWebApi = require('spotify-web-api-node');

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


    app.get('/', (req, res) => {
        res.render("index")
    })

app.get('/artist-search', (req, res) => {
    console.log(req.query.myText);
    spotifyApi
        .searchArtists(req.query.myText)
        .then(data => {
            // console.log(data.body.items);

            let searchResults = data.body.artists.items
            // console.log('The received data from the API: ', JSON.stringify(searchResults));
            console.log(data.body.artists.items[1].id);
            res.render('artist-search-results', { searchResults })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:id/:offset', (req, res) => {
    // console.log("REQUEST: ", req.params.id);
    spotifyApi
        .getArtistAlbums(req.params.id, { limit: 20, offset:req.params.offset * 20 },)
        .then(data2 => {
            let albumResults = data2.body
            // console.log("Album Information" , JSON.stringify(data2.body));

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('albums', { albumResults, site: (req.params.offset * 1) + 1 })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/tracks/:id', (req, res) => {
    // console.log(req.params.id);
    spotifyApi
    .getAlbumTracks(req.params.id, {limit:10, offset:0})
    .then((data) => {
        let trackResults = data.body.items
        // console.log("Track Information" , JSON.stringify(data.body.items));
        res.render('tracks', {trackResults})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

     
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  