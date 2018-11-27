const reasons = ["Mã code không còn hiệu lực", "Mã code đã quá hạn sử dụng", "Quá số lần sử dụng"];

module.exports = (req, res) => {
  // userId, distance, location, orderType, code...
  const userId = req.user.id;
  const code = req.body.code;

  if(code === "XINCHAOHCM") {
    return res.json({
      code: 200,
      data: {
        id: "5b5aee6c5c8fe30243a326af",
        strategy: {
          type: 'direct',
          value: 10
        }
      }
    })
  } else if(code === "HEYUHCM") {
    return res.json({
      code: 200,
      data: {
        id: "5b5aee6c5c8fe30243a326af",
        strategy: {
          type: 'percent',
          value: 30,
          maximum: 20
        }
      }
    })
  } else if(code === "DONGGIA1K") {
    return res.json({
      code: 200,
      data: {
        id: "5b5aee6c5c8fe30243a326af",
        strategy: {
          type: 'same',
          value: 1
        }
      }
    })
  } else {
    return res.json({
      code: 300,
      msg: reasons[Math.round(Math.random()*2)]
    })
  }
}
