// ==== IMPORTS

// ==== MODELS
const db = require('../models');

// ==== ROUTES
const getBirdingSessionBirds = async (req, res) => {
  try {
    // find all birds within a given birding session, whose id is provided by the URL through birdingSessionId
    const allBirds = await db.BirdingSession.findById(req.params.birdingSessionId)
      .populate('birds');
    // if allBirds is null, return an error 
    if (!allBirds.birds) {
      return res.status(400).json({
        status: 400,
        message: `No birds found in birding session ${req.params.birdingSessionId}`
      })
    }
    // else return data as JSON
    res.status(200).json({
      status: 200,
      allBirds: allBirds.birds
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong getting all birds"
    })
  }
}

// Create new bird in specified birding session
const createBird = async (req, res) => {
  try {
    // create a bird associated with birding session, whose id is provided by req.params.birdingSessionId
    const newBird = await db.Bird.create({
      ...req.body,
      birdingSession: req.params.birdingSessionId
    });
    // if newBird is null, return an error
    if (!newBird) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong creating a bird"
      })
    }
    // add bird id to BirdSession birds array
    const foundBirdingSession = await db.BirdingSession.findById(req.params.birdingSessionId);
    // if birding session doesn't exist, return an error
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: "Birding Session not found"
      })
    }
    // else push bird into array
    foundBirdingSession.birds.push(newBird._id);
    const savedBirdingSession = await foundBirdingSession.save();

    // return data as JSON
    res.status(200).json({
      status: 200,
      newBird
    })

  } catch (err) {
    res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong creating a bird"
    })
  }
}

// ==== EXPORTS
module.exports = {
  getBirdingSessionBirds,
  createBird,
  // getOneBird,
  // updateBird,
  // deleteBird,
}