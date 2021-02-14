'use strict';

const {GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const { Types } = require('mongoose');
const model = require('../models/Category');

// logic process
const _getAll = {
  type: new GraphQLList(categoryType),
  args: basePage,
  resolve: async(root, args) => {
    const _model = await model.find()
      .skip(args.skip ?? 0)
      .limit(args.take ?? 10)
      .populate('created_by')
      .exec();
    //
    return _model;
  }
}

const _getById = {
  type: categoryType,
  args: {
    ...basePage,
    _id: { type: GraphQLString },
  },
  resolve: async(root, args) => {
    const _model = await model
      .findById(args._id)
      .skip(args.skip ?? 0)
      .limit(args.take ?? 10)      
      .populate('created_by')
      .exec();
    //
    return _model;
  }
};

const _add = {
  type: categoryType,
  args: {
    title: { type: GraphQLString },
    logo: { type: GraphQLString },
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
};

const _update = {
  type: categoryType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    logo: { type: GraphQLString },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    args.created_by = Types.ObjectId(args.created_by);
    const _model = await model.findByIdAndUpdate(args._id, args, {new: true});
    //
    return _model;
  }
};

const _delete = {
  type: categoryType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const _model = await model.findByIdAndRemove(args._id);
    //
    return _model;
  }
};

module.exports = {
  getCategories: _getAll,
  getCategory: _getById,
  addCategory: _add,
  updateCategory: _update,
  removeCategory: _delete
}
