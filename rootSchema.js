'use strict';

const { GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const { getCategories, getCategory, addCategory, removeCategory } = require('./controllers/categoryController');

const appSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      categories: getCategories,
      category: getCategory
    })
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: {
      addCategory: addCategory,
      removeCategory: removeCategory
    }
  })
});

module.exports = appSchema;
