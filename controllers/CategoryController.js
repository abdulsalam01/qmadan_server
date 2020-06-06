'use strict';

const {GraphQLObjectType, GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const model = require('../models/category');

// logic process
const _getAll = {
  type: new GraphQLList(categoryType),
  resolve: async() => {
    const _model = await model.find().populate('created_by').exec();
    //
    return _model;
  }
}

const _getById = {
  type: categoryType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    const _model = await model.findById(args._id).populate('created_by').exec();
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
