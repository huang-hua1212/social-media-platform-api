const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: [true, '貼文姓名未填寫']
    // },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, '貼文姓名未填寫']
    },
    tags: [
      {
        type: String,
        required: [true, '貼文標籤 tags 未填寫']
      }
    ],
    type: {
      type: String,
      enum: ['group', 'person'],
      required: [true, '貼文類型 type 未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // select: false
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    likes: {
      type: Number,
      default: 0
    },
    whoLikes: [{
      type: mongoose.Schema.ObjectId,
      ref: "user",
    }],
    comments: {
      type: Number,
      default: 0
    },
    commentDetail: [{
      type: mongoose.Schema.ObjectId,
      ref: "comment_detail",
      default: [],
    }]
  },
  {
    versionKey: false,
    timestamps: true,
  }
)
const Post = mongoose.model('Post', postSchema);

module.exports = Post
