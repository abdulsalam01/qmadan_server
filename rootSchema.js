'use strict';

const { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { getCategories,
        getCategory,
        addCategory,
        updateCategory,
        removeCategory } = require('./controllers/categoryController');
const { getUsers,
        getUser,
        addUser,
        updateUser,
        removeUser } = require('./controllers/userController');

const appSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      categories: getCategories,
      category: getCategory,
      users: getUsers,
      user: getUser
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
      removeUser: removeUser
    }
  })
});

module.exports = appSchema;
