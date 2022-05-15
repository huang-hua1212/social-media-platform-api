const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, '名稱尚未填寫']
        },
        username: {
            type: String,
            required: [true, '帳號尚未填寫']
        },
        password: {
            type: String,
            required: [true, '密碼尚未填寫']
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
        role: {
            type: String,
            default: 'user',
        },
        sex: {
            type: String,
            default: '無性別',
        },
        photo: {
            type: String,
            default: 'photo',
        },
        followings: [{
            type: mongoose.Schema.ObjectId,
            ref: "following",
        }],
        // following: [{
        //     type: mongoose.Schema.ObjectId,
        //     ref: "user",
        // }],
        // following: [{
        //     user: {
        //         type: mongoose.Schema.ObjectId,
        //         ref: "user",
        //     },
        //     followAt: {
        //         type: Date,
        //         required: [true, '時間尚未填寫']
        //     }
        // }],
        createdAt: {
            type: Date,
            default: Date.now,
            // .find() 時不會顯示，像是隱藏欄位{_id: false}
            // select: false,
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
)

// 要放在SCHEMA下， API ROUTE之前
// findByIdAndUpdate 不會觸發中間建所以不可以用pre()
// uerSchema(uesrModel)每次執行save=>for find之前都要 加密(hash值)
// userSchema.pre('update', async function (next) {
//     // let update = { ...this.getUpdate() };

//     // // Only run this function if password was modified
//     // if (update.password) {

//     //     // Hash the password
//     //     const salt = genSaltSync();
//     //     update.password = await hash(this.getUpdate().password, salt);
//     //     this.setUpdate(update);
//     // }

//     // this 指向目前正被儲存的使用者 document
//     // console.log("update");
//     const user = this
//     // 確認使用者的 password 欄位是有被變更：初次建立＆修改密碼都算
//     if (user.isModified('password')) {
//         // 透過 bcrypt 處理密碼，獲得 hashed password
//         user.password = await bcrypt.hash(user.password, 8)
//     }
//     next();
// })


// 要放在SCHEMA下， API ROUTE之前
// uerSchema(uesrModel)每次執行save=>for model.create()之前都要 加密(hash值)
userSchema.pre('save', async function (next) {
    // this 指向目前正被儲存的使用者 document
    const user = this
    // 確認使用者的 password 欄位是有被變更：初次建立＆修改密碼都算
    if (user.isModified('password')) {
        // 透過 bcrypt 處理密碼，獲得 hashed password
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

// 產生jwt token
userSchema.methods.generateAuthToken = async function () {
    // this 指向當前的使用者實例
    const user = this
    // console.log(user);
    const payload = {
        _id: user._id.toString(), // 自訂聲明
        iss: user.username,
    }

    // 產生一組 JWT
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1 day' })
    // 將該 token 存入資料庫中：讓使用者能跨裝置登入及登出
    user.tokens = user.tokens.concat({ token })
    await user.save()

    // 回傳 JWT
    return token
}

// 加密
userSchema.methods.encryption = async function () {
    user.password = await bcrypt.hash(user.password, 8)
    // 回傳 JWT
    return user
}


// 驗證帳號密碼
userSchema.statics.findByCredentials = async (username, password) => {
    // 根據 email 至資料庫找尋該用戶資料
    const user = await userModel.findOne({ username })
    // 沒找到該用戶時，丟出錯誤訊息
    if (!user) {
        throw new Error('Unable to login')  // 非同步函式，跳到catch那裏
    }
    // 透過 bcrypt 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password)
    // 驗證失敗時，丟出錯誤訊息
    if (!isMatch) {
        // cathc error!
        throw new Error('Unable to login')  // 非同步函式，跳到catch那裏
    }
    // 驗證成功時，回傳該用戶完整資料
    return user
}

const userModel = mongoose.model('user', userSchema);



module.exports = userModel
