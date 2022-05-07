var axios = require('axios');
var FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });


function uploadImg(req, res, next) {
  const encodeImage64 = req.file.buffer.toString('base64');
  var data = new FormData();

  data.append('image', encodeImage64);
  
  const headers = {
    'Authorization': `Client-ID ${process.env.IMGUR_CLIENTID}`,
    ...data.getHeaders()
  };
  var config = {
    method: 'post',
    url: 'https://api.imgur.com/3/image',
    headers: {
      'Authorization': `Client-ID ${process.env.IMGUR_CLIENTID}`,
      ...data.getHeaders()
    },
    data: data
  };
  axios(config).then()
  axios.post('https://api.imgur.com/3/image', data, { 'headers': headers })
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      //   console.log(error);
    });
  // axios(config)
  // .then(function (response) {
  //   console.log(JSON.stringify(response.data));
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });
}
module.exports = uploadImg