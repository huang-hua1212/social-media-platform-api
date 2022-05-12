var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const postModel = require('../models/post');
// 此處導入model
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });



// 連結
const DB = process.env.DATABASE
  .replace(
    '<username>',
    process.env.DATABASE_USERNAME
  )
  .replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  )
mongoose.connect(DB)
  .then((res) => {
  })
  .catch((err) => {
  });




// // :id為哪篇po文之id
// router.get('/postLikes/:id', (req, res) => {
//     const postId = req.params.id;
//     postModel.findById(postId).populate({
//         path: 'followings',
//         select: '_id user whoFollow createdAt updateAt',
//         populate: {
//           path: 'user',
//           select: 'name photo'
//         }
//       }).exec(function (err, datas) {
//         // console.log(datas);
//         if (datas) {
//           res.status(200).json({
//             status: 'success',
//             datas,
//           });
//         } else {
//           res.status(400).json({
//             status: 'false',
//             message: "欄位未填寫正確，或無此 ID",
//           });
//         }
//       });
// })



// :id為哪篇po文之id
router.patch('/postLikes/:id', async (req, res) => {
  try {
    const userId = req.body.user_id;
    const postId = req.params.id;
    const post = await postModel.findOne({ _id: postId });
    // const userObjectId = mongoose.Types.ObjectId(userId);
    // post.whoFollow.push(userObjectId);
    await post.whoLikes.push(userId);
    post.save();
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch {
    res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 ID" });
  }
})

module.exports = router;