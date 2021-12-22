import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

function PlantAvatar(props) {
  
  const goal = props.goal;
  const isNew = props.isNew;

  const dispatch = useDispatch();

  const store = useSelector(store => store);
  const selectedGoal = useSelector(store => store.selectedGoal);

  const plantAvatars = useSelector(store  => store.plantAvatars);  

  const [displayEditIcon, setDisplayEditIcon] = useState(false);
  const [editingMode, setEditingMode] = useState(isNew || false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
  }, []);

  const cancelButton = () => {
    setEditingMode(false);
  }

  const editButton = () => {
    setEditingMode(true);
    setDisplayEditIcon(false);
  }

  const backButton = () => {
    selectedImageIndex === 0 ?
      setSelectedImageIndex(plantAvatars.length-1)
    : setSelectedImageIndex(selectedImageIndex-1);
  }

  const nextButton = () => {
    selectedImageIndex === plantAvatars.length-1 ?
      setSelectedImageIndex(0)
    : setSelectedImageIndex(selectedImageIndex+1);
  }

  const doneButton = () => {
    //since db is 1-indexed while this array is 0-indexed; add 1 for the next step.
    const plant_avatar_id = selectedImageIndex +1;

    dispatch({type: 'UPDATE_SELECTED_PLANT_AVATAR', payload: { plant_avatar_id: plant_avatar_id, goal_id: selectedGoal.id} });

    setEditingMode(false);
  }

  return (
    <div>
      { editingMode 
        ? 
         <div className="cardParent"> 
            <Button className="plantAvatarButtonBack" onClick={backButton}>Bk</Button>
              <img className="plantAvatarImage" src={plantAvatars[selectedImageIndex].image_path_stage_7}></img>
            <Button className="plantAvatarButtonNext" onClick={nextButton}>Nx</Button>
         </div>
        : 
         <div className="cardParent"> 
            <img className="plantAvatarImage" onClick={() => setDisplayEditIcon(true)} src={selectedGoal.current_avatar_path}></img>

              { displayEditIcon 
                ? 
                  <>
                    <Button onClick={editButton}>edit</Button>
                  </>
                :
                  <></>
              } 
          </div>
      }

      { editingMode 
        ?
          <>
            <Button onClick={doneButton}>Dn</Button>
            <Button onClick={cancelButton}>X</Button>
          </>
        :
          <></>  
      }

    </div>
  );
}

export default PlantAvatar;
