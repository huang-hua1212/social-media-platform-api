var express = require('express');
var router = express.Router();
const userModel = require('../models/user');

/* GET users BY id */
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

/* GET users listing. */
router.patch('/user/:id', function (req, res, next) {
  const obj = req.body;
  const keys_1 = Object.keys(obj);
  // const properties = ['name', 'tags', 'type', 'image', 'content', 'likes', 'comments'];
  const properties = ['name', 'username', 'password', 'role', 'sex', 'photo', 'tokens'];
  var resObj = {};
  const id = req.params.id;
  userModel.findByIdAndUpdate(id, resObj)
    .then((result) => {
      var fail = 0;
      if (!result) {
        throw new Error(false);
      }
      keys_1.forEach((value) => {
        if (properties.indexOf(value) === -1) {
          fail += 1;
        }
        resObj[value] = obj[value];
      })
      if (fail > 0) {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });

      } else {
        res.status(200).json({
          status: 'success',
          data: '更新成功',
        })
      }
    })
    .catch(() => {
      res.status(400).json({
        status: 'false',
        data: '更新失敗或無此ID',
      })
    });
});

module.exports = router;
