'use strict';
const { GraphQLObjectType } = require('graphql');
const { GraphQLJSON } = require('graphql-type-json');

const baseResponse = (name, type) => new GraphQLObjectType({
  name,
  description: 'baseResponse',
  fields: () => ({
    list: { type },
    pages: { type: GraphQLJSON }
  })
});

module.exports = baseResponse;
