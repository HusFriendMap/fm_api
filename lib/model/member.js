const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash')
const mongoConnections = require('../connections/mongo')

var MemberSchema = new mongoose.Schema({
    email : {
      type: String,
      unique: true
    },
    password: {type: String},
    phone : {type: String, default:""},
    name: {type: String},
    address: {type: String, default:""},
    status: {type: Number, default: 1},
    memberToken: {type: String},
    createdAt: { type: Number, default: Date.now },
    updatedAt: {type: Number, default: Date.now }
}, {id: false, versionKey: 'v'})


module.exports = mongoConnections('master').model('Member', MemberSchema);
