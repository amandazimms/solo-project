import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* socialSaga() {
  yield takeLatest('ADD_FOLLOWEE', addFollowee);
  yield takeLatest('SEARCH_FOR_FOLLOWEE', searchForFollowee);
  yield takeLatest('FETCH_FOLLOWEE_USERS', fetchFolloweeUsers);
  yield takeLatest('FETCH_FOLLOWEE_GOALS', fetchFolloweeGoals);
  yield takeLatest('ADD_LIKE', addLike);
  yield takeLatest('DELETE_LIKE', deleteLike);
}

// //worker Saga: will be fired on "ADD_LIKE" actions
function* addLike(action){
  const ap = action.payload;
  //ap.goal_id is goal id
  //ap.follower_like_status is t/f: whether follower likes this goal (now, after clicking heart to like/unlike)
  //ap.follower_id is follower (current user) 's id
  
  try {
    yield axios.post('/api/social/follower_like', 
        { goal_id: ap.goal_id, follower_id: ap.follower_id });    
    
    yield put({ type: 'UPDATE_GOAL_LIKE_COUNT', 
        payload: {  direction: "increment", 
                    goal_id: ap.goal_id, 
                    followee_id: ap.followee_id,
                    follower_id: ap.follower_id 
                  } });

  } catch {
    console.log('add like error');
  }
}

// //worker Saga: will be fired on "Delete_LIKE" actions
function* deleteLike(action){
  const ap = action.payload;
  //ap.goal_id is goal id
  //ap.follower_like_status is t/f: whether follower likes this goal (now, after clicking heart to like/unlike)
  //ap.follower_id is follower (current user) 's id
  
  try {
    yield axios.delete('/api/social/follower_like', 
        { params: {goal_id: ap.goal_id, follower_id: ap.follower_id} });    
    
    yield put({ type: 'UPDATE_GOAL_LIKE_COUNT', 
        payload: {  direction: "decrement", 
                    goal_id: ap.goal_id, 
                    followee_id: ap.followee_id,
                    follower_id: ap.follower_id 
                  } });

  } catch {
    console.log('delete like error');
  }
}

// worker Saga: will be fired on "FETCH_FOLLOWEE_USERS" actions
function* fetchFolloweeUsers(action) {
  const ap = action.payload;
  //ap = user id (user is follower, get followees)

  try {
    const response = yield axios.get('/api/social/followees', 
      { params: { follower_id: ap } });
    
    //RESPONSE.DATA is array of users (followees) that this user (follower) follows
    
    yield put({ type: 'SET_FOLLOWEE_USERS', payload: response.data });

  } catch (error) {
    console.log('followee get request failed', error);
  }
}

// worker Saga: will be fired on "FETCH_FOLLOWEE_GOALS" actions
function* fetchFolloweeGoals(action) {
  const ap = action.payload;
  //ap.followee_id is id of selectedFollowee (followee)
  //ap.follower_id is the id of the currently logged in user (follower)
  
  try {
    const followeeGoals = yield axios.get('/api/social/followee_goals', 
      {params: {followee_id: ap.followee_id, follower_id: ap.follower_id} });
    
    //followeeGoals.data[i] have properties: current_avatar_path, followee_id, goal_id, goal_name, like_count
    //e.g., followeeGoals.data[0].goal_id is first goal's id.

    const goalIDs = followeeGoals.data.map(item => item.goal_id);
    //goalIDs are the goal ids (only) of the fetched followee goals
    
    let likeStatusArray = [];

    //todo refactor to combine this and next loop
    for(let i=0; i<goalIDs.length; i++){
      let likeStatusThisGoal = yield axios.get('/api/social/follower_like_status',
        {params: {goal_id: goalIDs[i], follower_id: ap.follower_id} });

      likeStatusThisGoal.data.length === 0 ? likeStatusArray.push(false) : likeStatusArray.push(true);
    }
   
    let followeeGoalsToSet = [];

    for (let i=0; i<followeeGoals.data.length; i++){
      let thisGoal = {  current_avatar_path: followeeGoals.data[i].current_avatar_path,
                        followee_id: followeeGoals.data[i].followee_id,
                        goal_id: followeeGoals.data[i].goal_id,
                        goal_name: followeeGoals.data[i].goal_name,
                        like_count: followeeGoals.data[i].like_count,
                        follower_like_status: likeStatusArray[i]
                      }
      followeeGoalsToSet.push(thisGoal);                
    }                  

    yield put({ type: 'SET_FOLLOWEE_GOALS', payload: followeeGoalsToSet });

  } catch (error) {
    console.log('followee get request failed', error);
  }
}

// worker Saga: will be fired on "SEARCH_FOR_FOLLOWEE" actions
function* searchForFollowee(action) {
  const ap = action.payload;
  //ap.follower_id is follower id
  //ap.search_text is searchText

  try {  
    const search = yield axios.get('/api/social/search',
        {params: {search_text: ap.search_text, follower_id: ap.follower_id} })

    yield put({ type: 'SET_SEARCH_RESULTS', payload: search.data });

    } 
    catch (error) {
      console.log('followee search request failed', error);
    }     
  };

// worker Saga: will be fired on "ADD_FOLLOWEE" actions
function* addFollowee(action) {
  const ap = action.payload;
  //ap.followee is the id of the user to be followed (followee)
  //ap.follower is the id of the currently logged in user (follower)

  try {
    yield axios.post('/api/social/followee', { followee_id: ap.followee, follower_id: ap.follower });
    
    yield put({ type: 'FETCH_FOLLOWEE_USERS', payload: ap.follower });

  } catch {
    console.log('add new followee error');
  }
}

export default socialSaga;
