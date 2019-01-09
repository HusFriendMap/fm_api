const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash')
const mongoConnections = require('../connections/mongo')

var Favorite = new mongoose.Schema({
    placeId:{
      type:String
    },
    photo:{
      type:String,
      default:''
    },
    name:{
      type:String
    },
    address:{
      type:String
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member'
    },
    rating:{
      type: Number
    },
    status: { type: Number, default: 1},
    createdAt: { type: Number, default: Date.now },

}, {id: false, versionKey: 'v'})


module.exports = mongoConnections('master').model('Favorite', Favorite);
