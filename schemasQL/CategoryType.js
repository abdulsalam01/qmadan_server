'use strict';

const {GraphQLObjectType, GraphQLID, GraphQLString} = require('graphql');

const categoryType = new GraphQLObjectType({
  name: 'categoryType',
  description: 'This is represent a category',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    logo: { type: GraphQLString },
    create_at: { type: GraphQLString },
    created_by: { type: userType }
  })
});

module.exports = categoryType;
