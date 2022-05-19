const mongoose = require('mongoose');

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

module.exports = mongoose;