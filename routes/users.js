var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

/* GET users listing. */
router.get('/user/:id', function (req, res, next) {
  const id = req.params.id;

  userModel.findById(id).exec(function (err, datas) {
    // console.log(datas);
    if (datas) {
      res.status(200).json({
        status: 'success',
        datas,
      });
    } else {
      res.status(400).json({
        status: 'false',
        message: "欄位未填寫正確，或無此 ID",
      });
    }
  });
});


module.exports = router;
