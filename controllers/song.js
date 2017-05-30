'use strict'

// Para trabajar con ficheros
var path = require('path');
var fs = require('fs');

// Se importan los modelos de datos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getSong(req, res) {

    console.log('Llego a getSong');

    var songId = req.params.id;
    console.log(songId);


    Song.findById(songId).populate({path: 'album'}).exec(function (err, song) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!song){
                res.status(404).send({
                    message: 'La canción no existe'
                });
            }else{
                res.status(200).send({
                    song: song
                });
            }
        }
    });

}

function saveSong(req, res) {
    console.log('Llego a saveSong');
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save(function (err, songStored) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!songStored){
                res.status(404).send({
                    message: 'No se ha guardado la cancion'
                });
            }else{
                res.status(200).send({
                    song: songStored
                });
            }
        }
    })
}

module.exports = {
    getSong: getSong,
    saveSong: saveSong
}