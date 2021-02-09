'use strict';

const {GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const model = require('../models/Suggestion');

const _skeletonQL = (type, args = {}, ressolve) => {
    return {
        type,
        args,
        ressolve
    }
}

const _getAll = {
    ..._skeletonQL(new GraphQLList(suggestionType), basePage, 
        {
            ressolve: async(root, args) => { 
                const _model = await model.find()
                    .skip(args.skip ?? 0)
                    .limit(args.take ?? 10)
                    .populate('created_by')
                    .exec();
                //
                return _model;
            }
        })
}

const _getById = {
    ..._skeletonQL(suggestionType, {...basePage, _id: { type: GraphQLString },}, 
    {
        ressolve: async(root, args) => { 
            const _model = await model.findById(args._id)
                .skip(args.skip ?? 0)
                .limit(args.take ?? 10)
                .populate('created_by')
                .exec();
            //
            return _model;
        }
    })
}

const _add = {
    ..._skeletonQL(suggestionType, 
    {
        by: { type: GraphQLString },
        phone: { type: GraphQLString },
        body: { type: GraphQLString },
    }, 
    {
        resolve: async(root, args) => {
            const _model = new model(args);
            const _newModel = await _model.save();
            //
            return _newModel;
        }
    })
}

const _update = {
    ..._skeletonQL(suggestionType, 
        {
            _id: { type: new GraphQLNonNull(GraphQLString) },
            by: { type: GraphQLString },
            phone: { type: GraphQLString },
            body: { type: GraphQLString },
        }, 
        {
            resolve: async(root, args) => {
                const _model = await model.findByIdAndUpdate(args._id, args, {new: true});
                //
                return _model;
            }
        })
}

const _delete = {
    ..._skeletonQL(suggestionType, 
        {
            _id: { type: new GraphQLNonNull(GraphQLString) }
        }, 
        {
            resolve: async(root, args) => {
                const _model = await model.findByIdAndRemove(args._id);
                //
                return _model;
            }
        })
}

module.exports = {
    getSuggestions: _getAll,
    getSuggestion: _getById,
    addSuggetion: _add,
    updateSuggestion: _update,
    removeSuggestion: _delete
  }