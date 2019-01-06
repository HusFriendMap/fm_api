const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash')
const mongoConnections = require('../connections/mongo')

var MemberSchema = new mongoose.Schema({
    email : {type: String},
    password: {type: String},
    phone : {type: String},
    name: {type: String},
    address: {type: String},
    birthday: {
        day: { type: Number },
        month: { type: Number },
        year: {type : Number}
    },
    facebook: {
        id: {type: String,index:true,unique: true},
        realId: {type: String,index:true},
        name: {type: String},
        email: {type: String},
        birthday: {type: String},
        token: {type: String},
        locale: {type: String},
        timezone: {type: String},
        picture: {type: String}
    },
    status: {type: Number, default: 0},
    likes: {
      type: 'Number',
      default: 0
    },
    dislikes: {
      type: 'Number',
      default: 0
    },
    shop:{
      totalPost: {type: 'Number',default: 0},
      isAuthen: {
        type: 'Number',
        default: 0
      },
      totalPostOS: {type: 'Number', default: 0}
    },
    ship:{
      isAuthen: {
        type: 'Number',
        default: 0
      },
      totalRides: {
        type: 'Number',
        default: 0
      },
      totalRejects:{
        type: 'Number',
        default: 0
      }
    },
    coints: {
      type: 'Number',
      default: 0
    },
    realMoney: {
      type: 'Number',
      default: 0
    },
    expireTime: {
      type: 'Number',
      default: 0
    },
    blockUtil: {
      type: 'Number',
      default: 0
    },
    blockOrderUtil: {
      type: 'Number',
      default: 0
    },
    receivePushOrder: {
      type: 'Number',
      default: 1
    },
    memberToken: {type: String},
    granted: Boolean,
    createdAt: { type: Number, default: Date.now },
    location: { type: mongoose.Schema.Types.Mixed },
    updatedAt: {type: Number, default: Date.now }
}, {id: false, versionKey: 'v'})


module.exports = mongoConnections('master').model('Member', MemberSchema);
