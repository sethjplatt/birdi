const Users = require('../models/users.models')



async function collectUserInfo (req, res) {
  console.log(req.body.email);
  if (req.body.email) {
    try {
      //looks to see if email exists,
      const result = await Users.findOne({email:req.body.email})
      //if it doesn't create a new 'user' in table with that email
      if (!result) {
      const newdoc = await Users.create({email:req.body.email})
      // console.log(newdoc)
      res.status(200).send({data: newdoc, error: null})
      } else {
        await result.populate('birdSightingsIds')
        // console.log("found")
        res.status(200).send({data: result, error: null})
      }
    } catch (err) {
      console.log(err)
      res.status(500).send({data: null, error: err.message})
    }
  } else {
    res.status(500).send({data: null, error: 'No email supplied.'})
  }
}

module.exports = {collectUserInfo}