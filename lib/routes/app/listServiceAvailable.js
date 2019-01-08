const _ = require('lodash')
const async = require('async')
const CONSTANTS = require('../../const')
const MESSAGES = require('../../message')
const config = require('config');

module.exports = (req, res) => {
    const listService = [
      {
        name:"ATM",
        key:"atm",
      },
      {
        name:"Ngân hàng",
        key:"bank",
      },
      {
        name:"Cà phê",
        key:"cafe",
      },
      {
        name:"Bệnh viện",
        key:"hospital",
      },
      {
        name:"Công viên",
        key:"park",
      },
      {
        name:"Làm tóc",
        key:"hair_care",
      },
      {
        name:"CH quần áo",
        key:"clothing_store",
      },
      {
        name:"Nhà hàng",
        key:"restaurant",
      },
      {
        name:"Thú Y",
        key:"pet_store",
      },
      {
        name:"Xe buýt",
        key:"bus_station",
      },
      {
        name:"Trường học",
        key:"school",
      },
      {
        name:"Trạm xăng",
        key:"gas_station",
      },
      {
        name:"TT Mua sắm",
        key:"shopping_mall",
      },
      {
        name:"Hiệu thuốc",
        key:"pharmacy",
      },
    ]

    res.json({
      code:200,
      data:listService
    });
}
