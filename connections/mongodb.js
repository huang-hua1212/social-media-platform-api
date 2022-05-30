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
    .then(() => {})
    .catch((err) => {
        res.status(400).json({
            status: 'error',
            message: '連結失敗',
        });
    });

module.exports = mongoose;