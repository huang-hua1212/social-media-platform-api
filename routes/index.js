const express = require('express');
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// const headers = {
// 	"content-type": "application/json",
//     "Authorization": "<token>"
// };
// const graphqlQuery = {
//   "query": `query {
//     aa(age: 18) {
//       id 
//       name
//     }
//   }`,

// }


module.exports = router;
