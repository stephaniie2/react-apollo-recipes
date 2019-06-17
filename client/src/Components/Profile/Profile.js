import React from 'react';
import UserInfo from './UserInfo';
import UserRecipes from './UserRecipes';
import withAuth from '../WithAuth'

const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserRecipes session={session.getCurrentUser.username} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
