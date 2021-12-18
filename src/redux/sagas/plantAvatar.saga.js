import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* plantAvatarSaga() {
  yield takeLatest('FETCH_PLANT_AVATAR', fetchPlantAvatar);
  yield takeLatest('UPDATE_PLANT_AVATAR', updatePlantAvatar);
}

// worker Saga: will be fired on "FETCH_PLANT_AVATAR" actions
function* fetchPlantAvatar(action) {
  const ap = action.payload;

  let growthStage = 0;

  //todo add more logic for all 8 stages
  switch (true) {
    case (ap.progress > .5):
      growthStage = 8;
      break;
    case (ap.progress <= .5):
      growthStage = 2;
      break;
    default:
      growthStage = 0;
  }

  try {
    const response = yield axios.get('/api/plantAvatar', 
        { params: { id: ap.id, growthStage: growthStage } });
    
    //depending on the growth stage, response.data may look like, for example,
    //image_path_stage_5: '/images/plantAvatars/Bush5.png', or
    //image_path_stage_8: '/images/plantAvatars/Bush8.png'. 
    //to always get the value of the first (0) property, no matter the name of the key, we do the following:
    let val = Object.values(response.data)[0];

    yield put({ type: 'SET_PLANT_AVATAR', payload: val });

  } catch (error) {
    console.log('plant Avatar get request failed', error);
  }
}

//worker Saga: will be fired on "UPDATE_PLANT_AVATAR" actions
function* updatePlantAvatar(action){
  // const ap = action.payload;

  // try {
  //   const updatedTask = yield axios.put(`/api/plantAvatar/${ap.id}`, 
  //       { id: ap.id });
  //                                   //todo check on goal_id here v
  //   yield put({ type: 'FETCH_PLANT_AVATAR', payload: ap.goal_id });

  // } catch (error) {
  //   console.log("update Plant Avatar error", error);
  // } 
}





export default plantAvatarSaga;