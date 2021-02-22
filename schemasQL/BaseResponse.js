'use strict';
const { GraphQLObjectType, GraphQLScalarType } = require('graphql');
const { GraphQLJSON } = require('graphql-type-json');

const baseResponse = (name, type) => new GraphQLObjectType({
  name,
  description: 'baseResponse',
  fields: () => ({
    list: { type },
    pages: { type: GraphQLJSON },
    extras: {type: GraphQLJSON }
  })
});

const baseScalarDate = new GraphQLScalarType({
  name: 'Date',
  serialize: (value) => {
    return new Date(value.getTime()).toISOString();
  },
  parseValue: (value) => { return new Date(value); }
});

const baseScalarUrl = new GraphQLScalarType({
  name: 'UrlResolver',
  serialize: (value) => `${baseUrl}/${value}`,
  parseValue: (value) => value
});

module.exports = {
  baseResponse,
  baseScalarDate,
  baseScalarUrl
}
