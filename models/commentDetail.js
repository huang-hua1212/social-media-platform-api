const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: [true, 'userId未填寫']
        },
        content: {
            type: String,
            required: [true, 'content未填寫']
        },
        likes: {
            type: Number,
            default: 0
        },
        whoLikes: [{
            type: mongoose.Schema.ObjectId,
            ref: "user",
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
)


const Comment = mongoose.model('comment_detail', commentSchema);

module.exports = Comment