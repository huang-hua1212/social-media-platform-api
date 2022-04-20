const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, '帳號尚未填寫']
        },
        password: {
            type: String,
            required: [true, '密碼尚未填寫']
        }
    }
)
// 要放在SCHEMA下， API ROUTE之前
// uerSchema(uesrModel)每次執行save之前都要 加密(hash值)
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
    // 產生一組 JWT
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewproject')

    // 將該 token 存入資料庫中：讓使用者能跨裝置登入及登出
    user.tokens = user.tokens.concat({ token })
    await user.save()

    // 回傳 JWT
    return token
}

// 建立驗證方法
userSchema.statics.findByCredentials = async (email, password) => {
    // 根據 email 至資料庫找尋該用戶資料
    const user = await userSchema.findOne({ email })
    // 沒找到該用戶時，丟出錯誤訊息
    if (!user) { 
        throw new Error('Unable to login') 
    }
    // 透過 bcrypt 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password)
    // 驗證失敗時，丟出錯誤訊息
    if (!isMatch) { throw new Error('Unable to login') }
    // 驗證成功時，回傳該用戶完整資料
    return user
  }

const User = mongoose.model('User', userSchema);

module.exports = User
