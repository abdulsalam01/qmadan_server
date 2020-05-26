'use strict';

const { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { getCategories, getCategory, addCategory, removeCategory } = require('./controllers/categoryController');
const { getUsers, getUser, addUser, removeUser } = require('./controllers/userController');

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
    name: 'mutation',
    fields: {
      addCategory: addCategory,
      removeCategory: removeCategory,
      addUser: addUser,
      removeUser: removeUser
    }
  })
});

module.exports = appSchema;
