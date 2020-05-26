'use strict';

const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql');
const model = require('../models/user');

// logic process
const _getAll = {
  type: new GraphQLList(userType),
  resolve: async() => {
    const _model = model.find();
    //
    return _model;
  }
};

const _getById = {
  type: userType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const _model = model.findById(args._id);
    //
    return _model;
  }
};

const _add = {
  type: userType,
  args: {
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    const _model = new model(args);
    const _newModel = await _model.save();
    //
    return _newModel;
  }
};

const _delete = {
  type: userType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const _model = model.findByIdAndRemove(args._id);
    //
    return _model;
  }
};

module.exports = {
  getUsers: _getAll,
  getUser: _getById,
  addUser: _add,
  removeUser: _delete
}
