'use strict';

const { GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const { Types } = require('mongoose');
const model = require('../models/Category');

// logic process
const _getAll = {
  type: baseRes.baseResponse('allCategory', new GraphQLList(categoryType)),
  args: basePage,
  resolve: async(root, args) => {
    const take = args.take ?? 10;
    const skip = args.skip ?? 0;

    const _model = await model.find()
      .skip(skip)
      .limit(take)
      .populate('created_by')
      .exec();
    
    // re-init the file download
    const _newModel = _model.map(async(n) => {
      n.logo = await baseCloudGenerateLinkController(n.logo);
      return n;
    });
    //
    const _count = await model.find().countDocuments();
    const _res = {take, skip, total: _count};

    baseController.list = _newModel;
    baseController.pages = _res;

    return baseController;
  }
}

const _getById = {
  type: baseRes.baseResponse('oneCategory', categoryType),
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
    // re-init the file download
    _model.logo = await baseCloudGenerateLinkController(_model.logo);    
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
    // upload process
    return baseProccessController(async() => {
      const { filename, mimetype, createReadStream } = await args.logo;
      const stream = createReadStream();
      const file = await baseUploadController({stream, filename}, 'categories');
      
      args.created_by = Types.ObjectId(args.created_by);
      args.logo = file.locationFile;
      const _model = new model(args);
      const _newModel = await _model.save();
      //
      return _newModel;
    });
  }
};

// firebase upload
const _addToCloud = {
  type: categoryType,
  args: {
    title: { type: GraphQLString },
    logo: { type: GraphQLUpload },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    // upload process
    return baseProccessController(async() => {
      const { filename, mimetype, createReadStream } = await args.logo;
      const stream = createReadStream();
      const file = await baseUploadController({stream, filename}, 'categories');
      const firebase = await baseCloudUploadController(file.locationFile, 'categories');
      
      args.created_by = Types.ObjectId(args.created_by);
      args.logo = file.locationFile;
      const _model = new model(args);
      const _newModel = await _model.save();
      //
      return _newModel;
    });
  }
}

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
    return baseProccessController(async() => {
      const _model = await model.findByIdAndRemove(args._id);

      baseRemoveController(_model.logo);
      return _model;
    });
  }
};

const _deleteFromCloud = {
  type: categoryType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    return baseProccessController(async() => {
      const _model = await model.findByIdAndRemove(args._id);
      // remove from cloud
      const firebase = await baseCloudRemoveController(_model.logo);

      return _model;
    });
  }
}

module.exports = {
  getCategories: _getAll,
  getCategory: _getById,
  addCategory: _add,
  updateCategory: _update,
  removeCategory: _delete,
  addCategoryToCloud: _addToCloud,
  removeCategoryFromCloud: _deleteFromCloud
}
