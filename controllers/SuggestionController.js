'use strict';

const { GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql');
const model = require('../models/Suggestion');

const _getAll = {
    type: baseRes.baseResponse('allSuggestion', new GraphQLList(suggestionType)),
    args: basePage, 
    resolve: async(root, args) => { 
      const take = args.take ?? 10;
      const skip = args.skip ?? 0;

      const _model = await model.find()
        .skip(skip)
        .limit(take)
        .populate('created_by')
        .exec();
      //
      const _count = await model.find().countDocuments();
      const _res = {take, skip, total: _count};
  
      baseController.list = _model;
      baseController.pages = _res;
  
      return baseController
    }
}

const _getById = {
    type: baseRes.baseResponse('suggestion', suggestionType), 
    args: {...basePage, _id: { type: GraphQLString } },
    resolve: async(root, args) => { 
      const take = args.take ?? 10;
      const skip = args.skip ?? 0;

      const _model = await model.findById(args._id)
        .skip(skip)
        .limit(take)
        .populate('created_by')
        .exec();
      //
      const _count = await model.find().countDocuments();
      const _res = {take, skip, total: _count};
  
      baseController.list = _model;
      baseController.pages = _res;
  
      return baseController
    }
}

const _add = {
    type: suggestionType, 
    args: {
        by: { type: GraphQLString },
        phone: { type: GraphQLString },
        body: { type: GraphQLString },        
    },
    resolve: async(root, args) => {
        const _model = new model(args);
        const _newModel = await _model.save();
        //
        return _newModel;
    }
}

const _update = {
    type: suggestionType, 
    args: {
        _id: { type: new GraphQLNonNull(GraphQLString) },
        by: { type: GraphQLString },
        phone: { type: GraphQLString },
        body: { type: GraphQLString },
    }, 
    resolve: async(root, args) => {
        const _model = await model.findByIdAndUpdate(args._id, args, {new: true});
        //
        return _model;
    }
}

const _delete = {
    type: suggestionType, 
    args: { _id: { type: new GraphQLNonNull(GraphQLString) } },
    resolve: async(root, args) => {
        const _model = await model.findByIdAndRemove(args._id);
        //
        return _model;
    }
}

module.exports = {
    getSuggestions: _getAll,
    getSuggestion: _getById,
    addSuggetion: _add,
    updateSuggestion: _update,
    removeSuggestion: _delete
  }
