const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config({ path: '../../../.env' });

async function uploadImg(req, res, next) {
    const encodeImage64 = req.file.buffer.toString('base64');
    const data = new FormData();
    data.append('image', encodeImage64);
    const headers = {
        headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENTID}`,
            ...data.getHeaders(),
        }
    };

    axios.post('https://api.imgur.com/3/image', data, headers).then((result) => { // {"image":encodeImage64}
        const { id, link } = result.data.data;
        req.imgFile = { id, link };
        next();
    }).catch(() => {
        res.status(404).json({
            status: 'false',
            message: '上傳照片失敗，請重新上傳一次',
        })
    });
}

module.exports = uploadImg