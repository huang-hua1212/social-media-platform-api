var express = require('express');
var router = express.Router();

router.post('/sign_in', (req, res, next)=>{
    console.log(req);
    // console.log(123);
    // console.log(req.session);
     // ...
     if(req.body.firstName=="" || req.body.lastName=="")
     {
         console.log('firstName和lastName其一為空!!!');
         res.json({result: 'firstName和lastName其一為空!!!'});
        //  return res.redirect('Login.html');
     }else if(req.body.firstName==req.session.firstName
              && req.body.lastName==req.session.lastName)
                //如果輸入的,在session store已有儲存..
     {
         console.log('session已存在!!!連線次數加一');
          req.session.time++; //同一連線的登入次數, 就加 1
          res.json({result:'session已存在!!!連線次數加一'});
        //   return res.redirect('/session');    //就直接導向到...
     }
     else
     {
        console.log('session未存在，新增一個新的session!!!');

         //session store裡沒有的，就會重新設置
         req.session.firstName=req.body.firstName;
         req.session.lastName=req.body.lastName;
         req.session.time=1;
        //    return res.redirect('/session');
        res.json({result: 'session未存在，新增一個新的session!!!'});
     }
})

module.exports = router;