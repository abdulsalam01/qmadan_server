'use strict';

const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

const suggestionType = new GraphQLObjectType({
    name: 'SuggestionType',
    description: 'Suggestion form of story',
    fields: () =>  ({
        _id: { type: GraphQLID },
        by: { type: GraphQLString },
        phone: { type: GraphQLString },
        body: { type: GraphQLString },
        created_at: { type: GraphQLString }
    })
});

module.exports = suggestionType;