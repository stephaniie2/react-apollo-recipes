import React from 'react';
import { Link } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import { GET_USER_RECIPES, DELETE_USER_RECIPE } from '../queries';

const handleDelete = deleteUserRecipe => {
  const confirmDelete = window.confirm(
    'Are you sure want to delete this recipe?'
  );
  if (confirmDelete) {
    deleteUserRecipe().then(({ data }) => {
      console.log(data);
    });
  }
};

const UserRecipes = ({ username }) => (
  <Query query={GET_USER_RECIPES} variables={{ username }}>
    {({ data, loading, error }) => {
      if (loading) return <div>Loading</div>;
      if (error) return <div>Error</div>;
      console.log(data);
      return (
        <ul>
          <h3>Your Recipes</h3>
          {data.getUserRecipes.map(recipe => (
            <li key={recipe._id}>
              <Link to={`/recipes/${recipe._id}`}>
                <p>{recipe.name}</p>
              </Link>
              <p style={{ marginBottom: '0' }}>Likes: {recipe.likes}</p>
              <Mutation
                mutation={DELETE_USER_RECIPE}
                variables={{ _id: recipe._id }}
                update={(cache, { data: { deleteUserRecipe } }) => {
                  const { getUserRecipes } = cache.readQuery({
                    query: GET_USER_RECIPES,
                    variables: { username },
                  });

                  cache.writeQuery({
                    query: GET_USER_RECIPES,
                    variables: { username },
                    data: {
                      getUserRecipes: getUserRecipes.filter(
                        recipe => recipe._id !== deleteUserRecipe._id
                      ),
                    },
                  });
                }}
              >
                {(deleteUserRecipe, attrs = {}) => (
                  <p
                    className="delete-button"
                    onClick={() => handleDelete(deleteUserRecipe)}
                  >
                    {attrs.loading ? 'deleting...' : 'X'}
                  </p>
                )}
              </Mutation>
            </li>
          ))}
        </ul>
      );
    }}
  </Query>
);

export default UserRecipes;
