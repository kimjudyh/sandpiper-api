// ==== IMPORTS

// ==== MODELS
const db = require('../models');

// ==== ROUTES
// Get all birds in a given birding session
// GET '/birdingSession/:birdingSessionId'
const getBirdingSessionBirds = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // find all birds that have birding session id
    const allBirds = await db.Bird.find({birdingSession: req.params.birdingSessionId})
    .populate('behavior', 'name');
    console.log('all birds', allBirds)
    // find all birds within a given birding session, whose id is provided by the URL through birdingSessionId
    // const allBirds = await db.BirdingSession.findById(req.params.birdingSessionId)
      // .populate('birds');
    // if allBirds is null, return an error 
    if (!allBirds) {
      return res.status(400).json({
        status: 400,
        message: `No birds found in birding session ${req.params.birdingSessionId}`
      })
    }
    // else return data as JSON
    res.status(200).json({
      status: 200,
      // allBirds: allBirds.birds
      allBirds
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
// POST '/birdingSession/:birdingSessionId'
const createBird = async (req, res) => {
  // TODO: user authorization
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
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
    // remove?
    // const foundBirdingSession = await db.BirdingSession.findById(req.params.birdingSessionId);
    // if birding session doesn't exist, return an error
    // if (!foundBirdingSession) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Birding Session not found"
    //   })
    // }
    // else push bird into array
    // foundBirdingSession.birds.push(newBird._id);
    // const savedBirdingSession = await foundBirdingSession.save();

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

// Get one bird
// GET '/:birdingSessionId/bird/:id'
const getOneBird = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    console.log('birding session', req.params.birdingSessionId)
    console.log('bird', req.params.id)
    // find bird by id, provided by URL as req.params.id
    const foundBird = await db.Bird.findById(req.params.id)
      .populate('behavior', 'name');
    // if foundBird is null, return an error
    if (!foundBird) {
      return res.status(400).json({
        status: 400,
        message: "Bird not found"
      })
    }
    // else return data as JSON
    res.status(200).json({
      status: 200,
      foundBird
    });

  } catch (err) {
    return res.status(500).json({
      status: 300,
      err,
      message: "Something went wrong getting a bird"
    })
  }
}

// Update a bird
// PUT '/:birdingSessionId/bird/:id'
const updateBird = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // find bird by id and update it using req.body
    const updatedBird = await db.Bird.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    // if updatedBird is null, return an error
    if (!updatedBird) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong updating a bird"
      })
    }
    // else return data as JSON
    res.status(200).json({
      status: 200,
      updatedBird
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong updating a bird"
    })
  }
}

// Delete a bird
// DELETE '/:birdingSessionId/bird/:id'
const deleteBird = async (req, res) => {
  // check that user is logged in
  if (!req.session.currentUser) {
    return res.status(400).json({
      status: 400,
      message: "User not logged in"
    })
  } 
  try {
    // check user has permission to access this birding session
    const foundBirdingSession = await db.BirdingSession.findOne(
      {users: req.session.currentUser, _id: req.params.birdingSessionId}
    );
    if (!foundBirdingSession) {
      return res.status(400).json({
        status: 400,
        message: `Birding Session not found, or user doesn't have correct permissions`
      })
    }
    // find bird by id and delete from Bird db
    const deletedBird = await db.Bird.findByIdAndDelete(req.params.id);
    // if deletedBird is null, return an error
    if (!deletedBird) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong deleting a bird"
      })
    }
    // delete bird from associated birding session
    // remove?
    // const foundBirdingSession = await db.BirdingSession.findById(req.params.birdingSessionId);
    // if foundBirdingSession is null, return an error
    // if (!foundBirdingSession) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Something went wrong finding birding session"
    //   })
    // }
    // remove bird from birds array in birding session
    // foundBirdingSession.birds.pull({ _id: req.params.id });
    // const savedBirdingSession = await foundBirdingSession.save();
    // if savedBirdingSession is null, return an error
    // if (!savedBirdingSession) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Somthing went wrong saving birding session"
    //   })
    // }
    // else, return data as JSON
    res.status(200).json({
      status: 200,
      deletedBird
    })

  } catch (err) {
    return res.status(500).json({
      status: 500,
      err,
      message: "Something went wrong deleting a bird"
    })
  }
}

// ==== EXPORTS
module.exports = {
  getBirdingSessionBirds,
  createBird,
  getOneBird,
  updateBird,
  deleteBird,
}