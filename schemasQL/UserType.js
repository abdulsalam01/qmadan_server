'use strict';

const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const userType = new GraphQLObjectType({
  name: 'userType',
  description: 'This is represent a user',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});

module.exports = userType;
