var axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env' });

function refreshToken(req, res, next) {
    const data = {
        refresh_token: 'bd5335e7121c49c69ed2f86bbd9cff1f8fc18e98',
        client_id: process.env.IMGUR_CLIENTID,
        client_secret: process.env.IMGUR_CLIENTSECRET,
        grant_type: 'refresh_token',
    };

    // 記得不要加https://all-the-cors.herokuapp.com
    axios.post('https://api.imgur.com/oauth2/token', data).then(async (res) => {
        const { access_token, refresh_token } = await res.data;
        req.imgurToken = { access_token, refresh_token };
        next();
    }).catch(() => {
        res.status(404).json({
            status: 'false',
            message: '上傳照片失敗，請重新上傳一次',
        })
    });
}

module.exports = refreshToken