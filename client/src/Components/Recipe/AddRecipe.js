import React from 'react';
import { withRouter } from 'react-router-dom';

import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from '../queries';
import Error from '../Error';
import WithAuth from '../WithAuth';

const initialState = {
  name: '',
  instructions: '',
  category: 'Breakfast',
  description: '',
  username: '',
};

class AddRecipe extends React.Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username,
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      this.clearState();
      this.props.history.push('/');
    });
  };

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes],
      },
    });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_USER_RECIPES, variables: { username } },
        ]}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  type="text"
                  name="description"
                  placeholder="Add description"
                  onChange={this.handleChange}
                  value={description}
                />
                <textarea
                  name="instructions"
                  placeholder="Add instruction"
                  onChange={this.handleChange}
                  value={instructions}
                />
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default WithAuth(session => session && session.getCurrentUser)(
  withRouter(AddRecipe)
);
