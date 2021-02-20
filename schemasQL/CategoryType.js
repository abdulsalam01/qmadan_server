'use strict';

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLScalarType } = require('graphql');
const url = require('url');

const scalarDate = new GraphQLScalarType({
  name: 'Date',
  serialize: (value) => {
    return value.getTime();
  },
  parseValue: (value) => { return new Date(value); }
});

const scalarUrl = new GraphQLScalarType({
  name: 'UrlResolver',
  serialize: (value) => {
    const host = url.host;
    //
    return `${host}/${value}`;
  },
  parseValue: (value) => value
})

const categoryType = new GraphQLObjectType({
  name: 'categoryType',
  description: 'This is represent a category',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    logo: { 
      type: scalarUrl
    },
    create_at: {
      type: scalarDate,
      resolve: (val) => { return new Date(val) }
    },
    created_by: { type: userType }
  })
});

module.exports = categoryType;
