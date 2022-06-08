var express = require("express");
const app = require("../app");
var router = express.Router();
var mongoose = require('mongoose');
var cachegoose = require('cachegoose');
const userModel = require('../models/user');

// cachegoose(mongoose, {
//     engine: 'redis',    /* If you don't specify the redis engine,      */
//     // port: 6379,         /* the query results will be cached in memory. */
//     // host: 'localhost'
//     client: require('redis').createClient('redis://localhost:6379')
//   });
//   Record
//   .find({ some_condition: true })
//   .cache(30) // The number of seconds to cache the query.  Defaults to 60 seconds.
//   .exec(function(err, records) {
//     ...
//   });
 
router.get('/:id', (req, res)=>{
    const id = req.params.id;
    cachegoose(mongoose, {
        engine: 'redis',    /* If you don't specify the redis engine,      */
        // port: 6379,         /* the query results will be cached in memory. */
        // host: 'localhost'
        client: require('redis').createClient('redis://localhost:6379')
      });

    
    var  parentId ='aaaaaa'
    userModel.findById(id).populate({
        path: 'followings',
        select: '_id user whoFollow createdAt updateAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      }).populate({
        path: 'likePosts',
        select: '_id user image content createdAt updateAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      }).cache(30, `${ parentId }_children`) // cache(過期秒數, key名稱)
      .exec(function (err, datas) {
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
})
router.get('/123/:id', (req, res)=>{
    const id = req.params.id;
    cachegoose(mongoose, {
        engine: 'redis',    /* If you don't specify the redis engine,      */
        client: require('redis').createClient('redis://localhost:6379')
      });

    // userModel.findById(id).populate({
    //   path: 'followings',
    //   select: '_id user whoFollow createdAt updateAt',
    //   populate: {
    //     path: 'user',
    //     select: 'name photo'
    //   }
    // }).populate({
    //   path: 'likePosts',
    //   select: '_id user image content createdAt updateAt',
    //   populate: {
    //     path: 'user',
    //     select: 'name photo'
    //   }
    // }).cache(30).exec(function (err, datas) {
    //   if (datas) {
    //     res.status(200).json({
    //       status: 'success',
    //       datas,
    //     });
    //   } else {
    //     res.status(400).json({
    //       status: 'false',
    //       message: "欄位未填寫正確，或無此 ID",
    //     });
    //   }
    // });
    var  parentId ='aaaaaa'
    userModel.findById(id).populate({
        path: 'followings',
        select: '_id user whoFollow createdAt updateAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      }).populate({
        path: 'likePosts',
        select: '_id user image content createdAt updateAt',
        populate: {
          path: 'user',
          select: 'name photo'
        }
      }).exec(function (err, datas) {
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
})

module.exports = router