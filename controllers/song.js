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

function getSongs(req, res){
    console.log('Llego a getSongs');



    var albumId = req.params.id;


    /*var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemPerPage = 3;
    */

    if(!albumId){
        var find = Song.find({}).sort('name');
    } else{
        var find = Song.find({
            album: albumId
        }).sort('number');
    }

    find.populate({path: 'album'}).exec(function(err, songs){
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        }else {
            if(!songs){
                res.status(404).send({
                    message: 'No existen canciones'
                });
            } else {
                res.status(200).send({
                    songs: songs
                });
            }
        }
    })

}

function getArtists(req, res){

    if(req.params.page){
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var itemPerPage = 3;

    Artist.find().sort('name').paginate(page, itemPerPage, function (err, artists, total) {
        if(err){
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if(!artists){
                res.status(400).send({
                    messsage: 'No hay artistas'
                });
            } else {
                return res.status(200).send({
                    total_registos: total,
                    numero_pagina: page,
                    artists: artists
                });
            }
        }
    })

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

function updateSong(req, res){
    console.log('Llego a updateSong');

    var songId = req.params.id;
    var update = req.body;

    console.log(update);

    Song.findByIdAndUpdate(songId, update, function (err, songUpdated) {
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!songUpdated){
                res.status(404).send({
                    message: 'No se ha actualizado la canción'
                });
            }else{
                res.status(200).send({
                    song: songUpdated
                });
            }
        }
    })
}



function deleteSong(req, res){
    console.log('Llego a deleteSong');

    var songId = req.params.id;
    Song.findByIdAndRemove(songId, function(err, songRemoved){
        if(err){
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if(!songRemoved){
                res.status(404).send({
                    message: 'La canción no ha sido eliminado'
                });
            } else {
                res.status(200).send({
                    song: songRemoved
                });
            }
        }
    })

}





module.exports = {
    getSong: getSong,
    getSongs: getSongs,
    saveSong: saveSong,
    updateSong: updateSong,
    deleteSong: deleteSong
}