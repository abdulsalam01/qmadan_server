'use strict';
const { GraphQLInt, GraphQLObjectType } = require('graphql');

const baseQuery = new GraphQLObjectType({
    name: 'BaseQuery',
    description: 'Limit and take query',
    fields: () => ({
        take: { type: GraphQLInt },
        skip: { type: GraphQLInt }
    })
});

module.exports = baseQuery;