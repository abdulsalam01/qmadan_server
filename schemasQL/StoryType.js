'use strict';

const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

const storyType = new GraphQLObjectType({
  name: 'storyType',
  description: 'represent a story value',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    file: { type: baseRes.baseScalarUrl },
    type: { type: GraphQLString },
    created_at: { type: baseRes.baseScalarDate },
    category: { type: categoryType },
    created_by: { type: userType }
  })
});

module.exports = storyType;
