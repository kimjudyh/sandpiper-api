// ==== IMPORTS

// ==== MODELS
const db = require('../models');

// ==== ROUTES
const getAllBehaviors = async (req, res) => {
  try {
    // get all behaviors from db
    const allBehaviors = await db.Behavior.find();
    // if allBehaviors is null, return an erro
    if (!allBehaviors) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong getting all behaviors"
      })
    }
    // else return data as JSON
    res.status(200).json({
      status: 200,
      allBehaviors
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting all behaviors"
    })
  }
}

const createBehavior = async (req, res) => {
  try {
    // create a behavior in database
    const newBehavior = await db.Behavior.create(req.body);
    if (!newBehavior) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong creating behavior"
      })
    }
    res.status(200).json({
      status: 200,
      newBehavior
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong creating behavior"
    })
  }
}

// ==== EXPORT
module.exports = {
  getAllBehaviors,
  createBehavior,
}