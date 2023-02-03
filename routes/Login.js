const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE email = ? AND PASSWORD = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.log(err)
      } else if (result){
       console.log(result)
      } else {
        res.send({message: "Wrong email/password "})
      }
    }
  )

})

module.exports = router