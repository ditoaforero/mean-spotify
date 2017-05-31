'use strict'

// Para exponer rutas
var express = require('express');
var SongController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/autenticated');


var multipart = require('connect-multiparty');
var md_upload = multipart({
    uploadDir: './uploads/songs'
})

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:id?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);

module.exports = api;
