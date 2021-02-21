'use strict';

const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

const sliderType = new GraphQLObjectType({
  name: 'sliderType',
  description: 'represent data of slider',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    image: { type: baseRes.baseScalarUrl },
    created_at: { type: baseRes.baseScalarDate }
  })
});

module.exports = sliderType;
