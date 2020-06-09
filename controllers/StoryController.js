'use strict';

const {GraphQLObjectType, GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const model = require('../models/story');

// logic process
const _getAll = {
  type: new GraphQLList(storyType),
  resolve: async() => {
    const _model = await model.find().populate('category').populate('created_by').exec();
    //
    return _model;
  }
}

const _getById = {
  type: storyType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const _model = await model.findById(args._id).
                    populate('category').
                    populate('created_by').exec();
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
