import React from 'react';
import UserInfo from './UserInfo';
import UserRecipes from './UserRecipes';
import WithAuth from '../WithAuth'

const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserRecipes username={session.getCurrentUser.username} />
  </div>
);

export default WithAuth(session => session && session.getCurrentUser)(Profile);
