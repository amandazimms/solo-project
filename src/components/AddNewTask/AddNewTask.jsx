import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function AddNewTask(props) {

  const dispatch = useDispatch();

  const placeholderText = props.placeholderText || '';

  const [text, setText] = useState(props.text || '');

  const selectedGoal = useSelector(store => store.selectedGoal);
  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_TASKS', payload: {goal_id: selectedGoal.id, user_id: user.id}  }); 
  }, []);

  const handleChange = (event) =>{
    setText(event.target.value);
  }

  const doneButton = () => {
    let textToSend = text;

    let allSpaces = true;
    for (let i=0; i<text.length; i++)
      if (text[i] != " ")
        allSpaces = false;

    if (text === "" || allSpaces){
      textToSend = "New Task"
    }

    dispatch({ type: 'ADD_TASK', payload: {
      task: {
        task_name: textToSend,
        is_complete: false,
        goal_id: selectedGoal.id
        },
      user_id: user.id
    }});
    props.onLeaveAdd();
  }

  const cancelButton = () => {
    props.onLeaveAdd();
  }


  return (
    <>
      <input placeholder={placeholderText} type="text" className="smallInput" onChange={ (event) => handleChange(event) }></input>
      
      <img onClick={doneButton} className="iconImage confirmButton clickableSmall" src='./images/icons/GreenCheck.png' alt="Confirm new task"></img>

      <img onClick={cancelButton} className="iconImage cancelButton clickableSmall" src='./images/icons/RedEx.png' alt="Cancel new task"></img>
    </>
  );
}

export default AddNewTask;
