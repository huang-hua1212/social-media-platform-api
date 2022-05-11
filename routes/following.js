var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
const followingModel = require('../models/following');
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


// create folloing User
router.post('/following', (req, res) => {
    const obj = req.body;
    if (obj['user'] === undefined) {
        res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
    } else {
        followingModel.create(obj).then((data) => {
            res.status(200).json({
                status: "success",
                data,
            });
        }).catch((err) => {
            res.status(400).json({ status: 'false', message: "欄位未填寫正確，或無此 todo ID" });
        });
    }
})

module.exports = router;