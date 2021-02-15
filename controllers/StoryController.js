'use strict';

const {GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const { Types } = require('mongoose');
const model = require('../models/Story');

// logic process
const _getAll = {
  type: baseResponse('allStory', new GraphQLList(storyType)),
  args: basePage,
  resolve: async(root, args) => {
    const take = args.take ?? 10;
    const skip = args.skip ?? 0;

    const _model = await model.find()
      .skip(skip)
      .limit(take)
      .populate('category')
      .populate('created_by')
      .exec();
    //
    const _count = await model.find().countDocuments();
    const _res = {take, skip, total: _count};

    baseController.list = _model;
    baseController.pages = _res;

    return baseController;
  }
}

const _getById = {
  type: baseResponse('story', storyType),
  args: {
    ...basePage,
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const take = args.take ?? 10;
    const skip = args.skip ?? 0;

    const _model = await model.findById(args._id)
      .skip(args.skip ?? 0)
      .limit(args.take ?? 10)
      .populate('category')
      .populate('created_by')
      .exec();
    //
    const _count = await model.findById(args._id).countDocuments();
    const _res = {take, skip, total: _count};

    baseController.list = _model;
    baseController.pages = _res;

    return baseController;
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
