// 無需使用cookie-parser，就會自動在前端的cookie中儲存token值
var express = require('express');
var router = express.Router();

router.post('/sign_in', (req, res, next) => {
   console.log(req);
   if (req.body.firstName == "" || req.body.lastName == "") {
      res.json({ result: 'firstName和lastName其一為空!!!' });
   } else if (req.body.firstName == req.session.firstName
      && req.body.lastName == req.session.lastName)
   //如果輸入的,在session store已有儲存..
   {
      req.session.time++; //同一連線的登入次數, 就加 1
      res.json({ result: 'session已存在!!!連線次數加一' });
   }
   else {
      //session store裡沒有的，就會重新設置
      req.session.firstName = req.body.firstName;
      req.session.lastName = req.body.lastName;
      req.session.time = 1;
      res.json({ result: 'session未存在，新增一個新的session!!!' });
   }
})



// 進入需要驗證的頁面...
router.get('/verify', function (req, res) {
   var name = 'guest';
   var isLogin = false;
   var Logtime = 1;
   if (req.session.firstName && req.session.lastName) {
      name = req.session.firstName + ' ' + req.session.lastName;
      isLogin = true;
      Logtime = req.session.time;
   }

   res.json({ result: '驗證成功!!!' });
});

module.exports = router;