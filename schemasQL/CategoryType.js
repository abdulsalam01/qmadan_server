'use strict';

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLScalarType } = require('graphql');

const categoryType = new GraphQLObjectType({
  name: 'categoryType',
  description: 'This is represent a category',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    logo: { type: baseRes.baseScalarUrl },
    create_at: {
      type: baseRes.baseScalarDate,
      resolve: (val) => { return new Date(val) }
    },
    created_by: { type: userType }
  })
});

module.exports = categoryType;
