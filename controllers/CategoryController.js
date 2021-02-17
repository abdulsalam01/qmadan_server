'use strict';

const {GraphQLList, GraphQLString, GraphQLNonNull} = require('graphql');
const { Types } = require('mongoose');
const fs = require('fs');
const path = require('path');
const model = require('../models/Category');
const { GraphQLUpload } = require('graphql-upload');

// logic process
const _uploadFile = ({stream, filename}) => {
  const uploadDir = `../uploads`;
  const locationFile = path.join(__dirname, `${uploadDir}/${filename}`);

  return new Promise((resolve, reject) => {
    stream.on('error', err => {
        // delete the truncated file
        if (stream.truncated) fs.unlinkSync(locationFile);
        
        reject(err);
      })
      .pipe(fs.createWriteStream(locationFile))
      .on('error', err => reject(err))
      .on('finish', () => resolve({ locationFile }));
  });
}

const _getAll = {
  type: baseResponse('allCategory', new GraphQLList(categoryType)),
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

    return baseController;
  }
}

const _getById = {
  type: baseResponse('oneCategory', categoryType),
  args: {
    ...basePage,
    _id: { type: GraphQLString },
  },
  resolve: async(root, args) => {
    const take = args.take ?? 10;
    const skip = args.skip ?? 0;
    
    const _model = await model
      .findById(args._id)
      .skip(skip)
      .limit(take)
      .populate('created_by')
      .exec();
    //
    const _count = await model.findById(args._id).countDocuments();
    const _res = {take, skip, total: _count};

    baseController.list = _model;
    baseController.pages = _res;

    return baseController;
  }
};

const _add = {
  type: categoryType,
  args: {
    title: { type: GraphQLString },
    logo: { type: GraphQLUpload },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    args.created_by = Types.ObjectId(args.created_by);
    //
    const { filename, mimetype, createReadStream } = await args.logo;
    const stream = createReadStream();
    const pathObject = await _uploadFile({stream, filename});
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
