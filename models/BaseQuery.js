'use strict';
const { GraphQLInt } = require('graphql');

const pageField = {
    take: { type: GraphQLInt },
    skip: { type: GraphQLInt }
};

module.exports = pageField;
