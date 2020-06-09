const db = require('./models');
const behaviorData = require('./behaviorData.json');

// db.Behavior.update({}, behaviorData.behaviors, {upsert: true}, (err, seededBehaviors) => {
//   if (err) console.log(err);
//   else console.log(behaviorData.behaviors.length, 'behaviors created');
//   process.exit();
// })

db.Behavior.deleteMany({}, (err, deletedBehaviors) => {
  db.Behavior.create(behaviorData.behaviors, (err, seededBehaviors) => {
    if (err) console.log(err);
    console.log(behaviorData.behaviors.length, 'behaviors created successfully');
    process.exit();
  })
});