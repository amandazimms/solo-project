import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AddFollowee from '../AddFollowee/AddFollowee';
import ProfileImageThumbnail from '../ProfileImageThumbnail/ProfileImageThumbnail';

function SocialPage() {

  const store = useSelector(store => store);
  const user = useSelector(store => store.user);

  const searchResults = useSelector(store => store.search);

  const selectedFollowee = useSelector(store => store.selectedFollowee);
  const followees = useSelector(store => store.followeeUsers);

  const [searchOpen, setSearchOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'FETCH_FOLLOWEE_USERS', payload: user.id }); 
    dispatch({ type: 'FETCH_ALL_PROFILE_AVATARS' });

  }, []);

  const setSelectedFollowee = (followie) =>{
    dispatch( {type: 'SET_SELECTED_FOLLOWEE', payload: followie});
  }

  const openSearch = () => {
    setSearchOpen(true);
  }

  const closeSearch = () => {
    dispatch({ type: 'UNSET_SEARCH_RESULTS' });
    setSearchOpen(false);
  }

  const addThisFollowee = (foundUser) => {
    dispatch({ type: 'ADD_FOLLOWEE', payload: {followee: foundUser.id, follower: user.id} });
    closeSearch();
  }


  return (
    <div className="container">
      <h2 className="pageTitle">Social</h2>

      <div className="centerFlexContainer">

        { searchOpen 
          ? <AddFollowee onLeaveAdd={closeSearch}/>
          : <Button onClick={openSearch} className="iconButton">
              <img className="iconImage iconImageXL" src='./images/icons/AddIcon.png' alt="Add followed user"></img>
            </Button> 
        }
        
      </div>  

      { searchOpen
        ? 
          <>
          <h3 className="pageSubTitle">Search Results</h3>
          <div className="cards">
            {/* todo we reused some css classes that could be updated - "goal" and "plant" verbage below */}
            {searchResults.map(foundUser => {
              
              return (
                <div className="cardArea cardAreaSmall cardBlue" style={{padding: "0 0 10px 0"}} key={foundUser.id}>  
                  <ProfileImageThumbnail userToDisplay={foundUser} containerWidth={"160px"}/>

                  <h3 className="thumbnailGoalTitle">{foundUser.username}</h3>

                  <div className="centerFlexContainer">
                    <Button onClick={() => addThisFollowee(foundUser)} className="iconButton">
                      <img className="iconImage iconImageXL" src='./images/icons/AddIcon.png' alt="Add followed user"></img>
                    </Button> 
                  </div>

                </div>
                );
            })}

          </div>  
          </>

        : 
          <>
          <h3 className="pageSubTitle">Users I Follow</h3>
          <div className="cards">
            {/* todo we reused some css classes that could be updated - "goal" and "plant" verbage below */}
            {followees.map(followee => {
              
              return (
                <div className="cardArea cardAreaSmall cardBlue" style={{padding: "0 0 10px 0"}} key={followee.id}>  
                  <Link to="/followee-goals" onClick={() => setSelectedFollowee(followee)}>
                    <Button className="thumbnailButton">
                      <ProfileImageThumbnail userToDisplay={followee} containerWidth={"160px"}/>
                    </Button>
                  </Link>  
                    <h3 className="thumbnailGoalTitle">{followee.username}</h3>
                </div>

                );
            })}

          </div>  
          </>
      }
      

    </div>
  );
}

export default SocialPage;
