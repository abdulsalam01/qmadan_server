'use strict';

const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { getCategories,
  getCategory,
  addCategory,
  updateCategory,
  removeCategory } = require('./controllers/CategoryController');
const { getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser } = require('./controllers/UserController');
const { getStories,
  getStory,
  addStory,
  updateStory,
  removeStory } = require('./controllers/StoryController');
const {
  getSuggestions,
  getSuggestion,
  addSuggetion,
  updateSuggestion,
  removeSuggestion
} = require('./controllers/SuggestionController');

const appSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      categories: getCategories,
      category: getCategory,
      users: getUsers,
      user: getUser,
      stories: getStories,
      story: getStory,
      suggestions: getSuggestions,
      suggestion: getSuggestion,
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addCategory: addCategory,
      updateCategory: updateCategory,
      removeCategory: removeCategory,
      addUser: addUser,
      updateUser: updateUser,
      removeUser: removeUser,
      addStory: addStory,
      updateStory: updateStory,
      removeStory: removeStory,
      addSuggetion,
      updateSuggestion,
      removeSuggestion
    }
  })
});

module.exports = appSchema;
