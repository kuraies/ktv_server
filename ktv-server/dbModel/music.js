const mongoose = require('mongoose')

const musicModel = mongoose.Schema({
    songName: {
        required: true,
        type: String
    },
    artist: {
        required: true,
        type: String
    },
    poster: {// 封面图片地址
        required: true,
        type: String
    },
    src: {
        required: true,
        type: String
    },
    language: {
        type: String
    },
    style: {
        type: String
    },
    playCount: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    AudioMD5: {
        type: String,
        required: true
    },
    like: {
        type: String,
        default: 0,
    }
})

module.exports = mongoose.model('Music', musicModel)