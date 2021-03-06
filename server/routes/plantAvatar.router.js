const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/selected', (req,res) => {
  // console.log('*** in pa router GET. req.params:', req.params);
  // console.log('*** in pa router GET. req.query:', req.query);
  // console.log('*** in pa router GET. req.body:', req.body);

  //req.query.growthStage is the 0-7 growth stage of this plant
  //req.query.id is the goal id
  const queryString = `SELECT image_path_stage_${req.query.growthStage} 
      FROM "goal"
      JOIN "plant_avatar" ON goal.plant_avatar_id=plant_avatar.id 
      WHERE goal.id=${req.query.id};`
  
  pool.query(queryString).then((results)=>{
    res.send(results.rows[0]);

  }).catch((err)=>{
    console.log('error with plant_avatar GET:', err);
    res.sendStatus(500);
  })
})

router.get('/all', (req,res) => {
  const queryString = `SELECT "image_path_stage_7"
      FROM "plant_avatar" 
      ORDER BY id;`
  
  pool.query(queryString).then((results)=>{
    res.send(results.rows);

  }).catch((err)=>{
    console.log('error with plant_avatar GET:', err);
    res.sendStatus(500);
  })
})

router.put('/:id', (req, res) => {
  // console.log('*** in pa router PUT. req.query:', req.query);
  // console.log('*** in pa router PUT. req.body:', req.body);
  // console.log('*** in pa router PUT. req.params:', req.params);

  // req.body.plant_avatar_id is our plant avatar id
  // req.params.id is our goal id

  const queryString = `UPDATE "goal" SET 
      plant_avatar_id=$1 
      WHERE id=${req.params.id} 
      RETURNING "progress"`;

  values = [req.body.plant_avatar_id];

  pool.query(queryString, values)
    .then((results)=>{
      res.send(results.rows[0])

    }).catch((err) => {
      console.log('PUT goal plant avatar failed: ', err);
      res.sendStatus(500);
    });
});

module.exports = router;
