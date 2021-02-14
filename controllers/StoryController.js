'use strict';

const {GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const { Types } = require('mongoose');
const model = require('../models/story');

// logic process
const _getAll = {
  type: new GraphQLList(storyType),
  args: basePage,
  resolve: async(root, args) => {
    const _model = await model.find()
      .skip(args.skip ?? 0)
      .limit(args.take ?? 10)
      .populate('category')
      .populate('created_by')
      .exec();
    //
    return _model;
  }
}

const _getById = {
  type: storyType,
  args: {
    ...basePage,
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const _model = await model.findById(args._id)
                  .skip(args.skip ?? 0)
                  .limit(args.take ?? 10)
                  .populate('category')
                  .populate('created_by')
                  .exec();
    //
    return _model;
  }
}

const _add = {
  type: storyType,
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    category: { type: GraphQLString },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    args.created_by = Types.ObjectId(args.created_by);
    //
    const _model = new model(args);
    const _newModel = await _model.save();
    //
    return _newModel;
  }
}

const _update = {
  type: storyType,
  args: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    category: { type: GraphQLString },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    args.created_by = Types.ObjectId(args.created_by);
    
    const _model = await model.findByIdAndUpdate(args._id, args, {new: true});
    //
    return _model;
  }
}

const _delete = {
  type: storyType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    const _model = model.findByIdAndRemove(args._id);
    //
    return _model;
  }
}

module.exports = {
  getStories: _getAll,
  getStory: _getById,
  addStory: _add,
  updateStory: _update,
  removeStory: _delete
}
