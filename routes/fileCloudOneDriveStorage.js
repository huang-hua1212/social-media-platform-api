const express = require("express");
const pcloudSdk = require('pcloud-sdk-js');
const router = express.Router();
const oauth = require('pcloud-sdk-js').oauth;
const dotenv = require('dotenv');
const fs = require('fs');
const appError = require('../services/appError');
const { default: axios } = require("axios");
const multer = require('multer');
dotenv.config({
    path: './.env'
});

const uploadMulter = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype == " application/msword" || file.mimetype == "application/pdf" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
            return
        } else {
            cb(null, false)
            return cb(new Error('Allowed only .doc .pdf .png, .jpg, .jpeg'))
        }
    }
})

router.post('', uploadMulter.single('file'), async (req, res) => {
    const access_token = process.env.ONEDRIVE_ACCESS_TOKEN;
    const client = await pcloudSdk.createClient(access_token);
    console.log(client.userinfo());
    client.listfolder(0).then((fileMetadata) => {
        console.log(fileMetadata);
    });
});

router.post('/getToken', async (req, res) => {
    const client_id = 'kPa0QrxLKRB';
    const secret = 'UTRv7l8SlJHAkpoTerrSs8Ow51tk';
    oauth.getTokenFromCode(20, client_id, secret)
        .then((res) => {
            console.log('Received token: ', res.access_token);
        })
});

// 上傳檔案
router.put('/upload-docx', async (req, res) => {
    await fs.readFile('TestFile.docx', async function (err, f) {
        if (err) {
            throw err;
        }
        const access_token = process.env.ONEDRIVE_ACCESS_TOKEN;
        const bearerToken = `Bearer ${access_token}`;
        const url = 'https://graph.microsoft.com/v1.0/me/drive/root:/FolderA/FileB.docx:/content';
        const body = f
        axios.defaults.headers.common.Authorization = bearerToken;
        await axios.put(url, body).then(result => {
            res.status(200).json({
                status: 'success',
                message: '上傳成功'
            })
        }).catch(err => {
            // return appError(400, "上傳失敗", next);
            return appError(400, err, next);
        })
    });
});

// 上傳檔案
router.put('/upload-txt', async (req, res) => {
    // 上傳txt檔
    await fs.readFile('TestFile.txt', function (err, f) {
        if (err) {
            throw err;
        }
        const token = 'EwBoA8l6BAAUkj1NuJYtTVha+Mogk+HEiPbQo04AAbUfuNdGU13BLTsca5VZ5IyChKEHcZpgPKqnN8hIyY1ITflvYJlSV6UOqFMSkZhSbmxtphz7oOmz35WcL10eg9Z9f6EEn5Es+NVU04DamB5pH1J01e2Uyq6gDUA6+ylXaf4bvw2IgqPKj4wANUx8WomMJim7p1/INJQXDgBx7liaH+o6mgz6rT8wBIhT0KUHQSlj/LACu00LsT1a+y7WBtgqPmRJ4S4JgchpDtj8nhFLlwHOYzEUlpcwNEkiqbDGjgaMTKmE0qarBbidx2ojUoJAebFHq/QKF8AUhvuXkmtnzl3nYm4X+Edw4aAAk40Uz82sQ7uRTfBO8RCqGdB5YIQDZgAACOWy9hE48r6uOAIdlCfA74HSbI69Fc6AfRRZNEMq3hp40hMpAVeEkOHYmzwvYX8VwBN8CF1VcLH5ie9cUapaijNL6GiYmwWWlX52WKKChOhLpJUyV4groZNByQsjDCqhq6zB3uYOjtEVDVlWun62XleNXArX8npg0jWS4SVyS6XXtFthBSD/J4GceJFmdJH0+TwJY0T8u4OwvD3D5rTqH9iPAqIzU6XA8gI+uYeoOTZzAnONdoTDl5KIZPf9EUyRz7hXc13P5PyKOm1nawiJBfskb6DZ8M5PF0o8sKxs0vLin3nkFUFVhPlqbB461UECiIorIYhOxMw6tVkybq88nk5bWYCdvR4AkS9pEo2327/71vrNzSOGqnCX2NJQ41BKlAJF2kagiTYRUJeaUaPdoJOIcms2lHl8QlfQ/ZeexcIVLxki0bz45aRkV1hKqxFIvvNylppIeF+S+mQ45stb0CyjB6730fzTddJPJb9zapjymKmNz5g/FRcagJ/pZqRFgEmwcuYNWBQj4bHUZCWdGRPylZid95ev+dtRhnhgod6GNojEtVdwGxXbVa/I8/wa8eQjE+wxB7aaUGR1y3/3hum4uyl/8BAI193/DnY4XUrMqCW6IPGtquE3xQQ5tAy2x+hLJRpyxowoZsYG6Et7Uve4SuV9YEt1hCxdeY2dhnGXtim/LUh2MFavls5hDlJieAx+U+xfnrzsmFN513j4+7TMKC4ycwtYiavsyOxheFYrzvWh+bGNvniRq0d6eOD5f6tBfQI=';
        const bearerToken = `Bearer ${token}`;
        const url = 'https://graph.microsoft.com/v1.0/me/drive/root:/FolderA/FileB.txt:/content';
        const body = f
        axios.defaults.headers.common.Authorization = bearerToken;
        axios.put(url, body).then(res => {
            res.status(200).json({
                status: 'success',
                message: '上傳成功'
            })
        }).catch(err => {
            // return appError(400, "上傳失敗", next);
            return appError(400, err, next);
        })
    });
});


module.exports = router;