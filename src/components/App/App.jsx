import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import ProfilePage from '../ProfilePage/ProfilePage';
import GoalsPage from '../GoalsPage/GoalsPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';
import GoalPage from '../GoalPage/GoalPage';
import SocialPage from '../SocialPage/SocialPage';

import './App.css';

function App() {
  const dispatch = useDispatch();

  const user = useSelector(store => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        {/* If a user is logged in, show nav bar */}
        {user.id &&
          <Nav />
        } 
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          {/* todo when more of the app is together, decide where to reroute this.  */}
          <Redirect exact from="/" to="/home" />
          
          {/* shows Public Goals page at all times (logged in or not) */}
          {/*todo implement only for stretch goal <Route exact path="/public-goals">
            <PublicGoalsPage />
          </Route> */}

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the ProfilePage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
         
         {/* logged in shows ProfilePage, else shows LoginPage */}
          <ProtectedRoute exact path="/profile">
            <ProfilePage/>
          </ProtectedRoute>

          {/* logged in shows GoalsPage, else shows LoginPage */}
          <ProtectedRoute exact path="/goals">
            <GoalsPage />
          </ProtectedRoute>

          {/* logged in shows GoalsPage, else shows LoginPage */}
          <ProtectedRoute exact path="/followee-goals">
            <GoalsPage isFollowees={true}/>
          </ProtectedRoute>

           {/* logged in shows SocialPage, else shows LoginPage */}
           <ProtectedRoute exact path="/social">
            <SocialPage />
          </ProtectedRoute>

          {/* logged in shows GoalPage, else shows LoginPage */}
          <ProtectedRoute exact path="/goal">
            <GoalPage />
          </ProtectedRoute>

          {/* logged in shows GoalPage w/ props, else shows LoginPage */}
          <ProtectedRoute exact path="/new-goal">
            <GoalPage isNew={true}/>
          </ProtectedRoute>

          <Route exact path="/login">
            {user.id ?
              // If the user is already logged in, redirect to the /goals page
              <Redirect to="/goals" /> :
              // Otherwise, show the login page
              <LoginPage />
            }
          </Route>

          <Route exact path="/registration">
            {user.id ?
              // If the user is already logged in, redirect them to the /goals page
              <Redirect to="/goals" /> :
              // Otherwise, show the registration page
              <RegisterPage />
            }
          </Route>

          <Route exact path="/home">
            {user.id ?
              // If the user is already logged in, redirect them to the /user page
              <Redirect to="/goals" /> :
              // Otherwise, show the Landing page
              <LandingPage />
            }
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
