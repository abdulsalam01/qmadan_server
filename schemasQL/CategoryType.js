'use strict';

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLScalarType} = require('graphql');

const scalarDate = new GraphQLScalarType({
  name: 'Date',
  serialize: (value) => {
    const year = value.getFullYear();
    const month = value.getMonth();
    const day = value.getDate();

    return `${year}-${month}-${day}:${value.getTime()}`;
  },
  parseValue: (value) => { return new Date(value); }
});

const categoryType = new GraphQLObjectType({
  name: 'categoryType',
  description: 'This is represent a category',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    logo: { type: GraphQLString },
    create_at: {
      type: scalarDate,
      resolve: () => { return new Date() }
    },
    created_by: { type: userType }
  })
});

module.exports = categoryType;
