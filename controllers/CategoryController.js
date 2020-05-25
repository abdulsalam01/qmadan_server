'use strict';

const {GraphQLObjectType, GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const model = require('../models/category');
const modelType = require('../schemasQL/categoryType');

// logic process
const _getAll = {
  type: new GraphQLList(modelType),
  resolve: async() => {
    const _model = await model.find();
    //
    return _model;
  }
}

const _getById = {
  type: modelType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    const _model = await model.findById(args._id);
    //
    return _model;
  }
}

const _add = {
  type: modelType,
  args: {
    title: { type: GraphQLString },
    logo: { type: GraphQLString },
    created_by: { type: GraphQLString }
  },
  resolve: (root, args) => {
    const _model = new model(args);
    const _newModel = _model.save();
    //
    return _newModel;
  }
};

const _delete = {
  type: modelType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const _model = await model.findByIdAndRemove(args._id);
    //
    return _model;
  }
}

module.exports = {
  getCategories: _getAll,
  getCategory: _getById,
  addCategory: _add,
  removeCategory: _delete
}
