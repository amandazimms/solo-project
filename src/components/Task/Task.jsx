import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

function Task(props) {

  const task = props.task;

  const dispatch = useDispatch();

  const store = useSelector(store => store);
  const selectedGoal = useSelector(store => store.selectedGoal);

  const [displayIcons, setDisplayIcons] = useState(false);

                  //todo what is task.isEditingMode?
  const [editingMode, setEditingMode] = useState(props.isEditingMode || false);

  const [text, setText] = useState(task.task_name || '');

  const [showComplete, setShowComplete] = useState(task.is_complete);
  const [checkBoxImage, setCheckBoxImage] = useState(showComplete ? './images/icons/CheckedBox.png' : './images/icons/Box.png');
  
  
  const checkedBoxImgPath = './images/icons/CheckedBox.png';
  const boxImgPath = './images/icons/Box.png';


  useEffect(() => {
  }, []);

  const handleChange = (event) =>{
    setText(event.target.value);
  }

  const toggleCompleted = () => {
    let taskToSend = {
      task_name: task.task_name,
      id: task.id,
      goal_id: selectedGoal.id
      //is_complete gets add in the next step, depending if true/false
    }

    //todo this could be DRYer
    if (showComplete) { //if task was complete and we clicked, we mark UN complete
      setShowComplete(false);
      setCheckBoxImage('./images/icons/Box.png');
      taskToSend.is_complete = false;
    } 
    else { //if task was incomplete and we clicked, mark COMPLETE
      setShowComplete(true);
      setCheckBoxImage('./images/icons/CheckedBox.png');
      taskToSend.is_complete = true;
    }

    dispatch({type: 'UPDATE_TASK', payload: taskToSend });
  }



  const doneButton = () => {
    const taskToSend = {
      task_name: text,
      id: task.id,
      is_complete: task.is_complete,
      goal_id: selectedGoal.id
    }
    dispatch({type: 'UPDATE_TASK', payload: taskToSend });

    setEditingMode(false);
  }

  const cancelButton = () => {
    setEditingMode(false);
  }

  const editButton = () => {
    setEditingMode(true);
    setDisplayIcons(false);
  }

  const deleteButton = () => {
    if (confirm("delete this task?")){
      // delete this task/goal from the db, and make sure to re-render (get again)
      setDisplayIcons(false);
      setEditingMode(false);
      
      dispatch({type: 'DELETE_TASK', payload: task});
    }
  }

  return (
    <div>
      { editingMode 
        ? 
         <>
          <input className="taskContent" value={text} placeholder={task.task_name} type="text" onChange={ (event) => handleChange(event) }></input>
          <Button className="taskContent" onClick={doneButton}>done</Button>
          <Button className="taskContent" onClick={cancelButton}>cancel</Button>
         </>
        : 
          <>
            <Button className="iconButton checkButton taskContent" onClick={() => toggleCompleted()}>
              <img className="iconImage" src={checkBoxImage} alt="Mark task incomplete"></img>
            </Button>
           
            {/* todo also style this text as strikethru vs not if it's complete vs not. */}
            <p className="taskText taskContent" onClick={() => setDisplayIcons(true)}>{text}</p>
 
            { displayIcons 
              ? 
                <>
                  <Button onClick={editButton} className="iconButton editDeleteIconButton"> 
                    <img className="iconImage editDeleteIcon" src='./images/icons/EditIcon.png' alt="Edit task"></img>
                  </Button>
                  <Button onClick={deleteButton} className="iconButton editDeleteIconButton">
                    <img className="iconImage" src='./images/icons/TrashIcon.png' alt="Delete task"></img>
                  </Button>
                </>
              :
                <></>
            } 
          </>
      }

    </div>
  );
}

export default Task;
