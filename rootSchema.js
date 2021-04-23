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
  getStoryByCategory,
  getStoryByTitle,
  getStory,
  addStory,
  addToCloud,
  updateStory,
  removeStory } = require('./controllers/StoryController');
const {
  getSuggestions,
  getSuggestion,
  addSuggetion,
  updateSuggestion,
  removeSuggestion
} = require('./controllers/SuggestionController');
const {
  getSliders,
  getSlider,
  addSlider,
  updateSlider,
  removeSlider
} = require('./controllers/SliderController');

const appSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      categories: getCategories,
      category: getCategory,
      users: getUsers,
      user: getUser,
      stories: getStories,
      storyByCategory: getStoryByCategory,
      storyByTitle: getStoryByTitle,
      story: getStory,
      suggestions: getSuggestions,
      suggestion: getSuggestion,
      sliders: getSliders,
      slider: getSlider      
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
      removeSuggestion,
      addSlider,
      updateSlider,
      removeSlider,
      // firebase-bucket
      addToCloud
    }
  })
});

module.exports = appSchema;
