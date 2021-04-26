'use strict';

const { GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const { Types } = require('mongoose');
const model = require('../models/Story');

// logic process
const _getAll = {
  type: baseRes.baseResponse('allStory', new GraphQLList(storyType)),
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

    // re-init the file download
    const _newModel = _model.map(async(n) => {
      n.file = await baseCloudGenerateLinkController(n.file);
      return n;
    });
    //
    const _count = await model.find().countDocuments();
    const _res = {take, skip, total: _count};
    const _musicsList = await baseReadDirController(baseUrl, `mp3s`);

    baseController.list = _newModel;
    baseController.pages = _res;
    baseController.extras = _musicsList;

    return baseController;
  }
}

const _getByCategory = {
  type: baseRes.baseResponse('story', new GraphQLList(storyType)),
  args: {
    ...basePage,
    _id: { type: GraphQLString },
    category: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    const take = args.take ?? 10;
    const skip = args.skip ?? 0;

    const _model = await model.find({category: args.category})
      .skip(skip)
      .limit(take)
      .populate('category')
      .populate('created_by')
      .exec();
    
    // re-init the file download
    const _newModel = _model.map(async(n) => {
      n.file = await baseCloudGenerateLinkController(n.file);
      return n;
    });
    //
    const _count = await model.find()
      .populate({
        path: 'category',
        match: { _id: Types.ObjectId(args.category) }
      })
      .countDocuments();
    
    const _res = {take, skip, total: _count};
    const _musicsList = await baseReadDirController(baseUrl, `mp3s`);

    baseController.list = _newModel;
    baseController.pages = _res;
    baseController.extras = _musicsList;

    return baseController;
  }
}

const _getById = {
  type: baseRes.baseResponse('storyById', storyType),
  args: {
    ...basePage,
    _id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async(root, args) => {
    const take = args.take ?? 10;
    const skip = args.skip ?? 0;

    const _model = await model.findById(args._id)
      .populate('category')
      .populate('created_by')
      .exec();
    
    // re-init the file download
    _model.file = await baseCloudGenerateLinkController(_model.file);
    //
    const _count = await model.findById(args._id)
      .populate('category')
      .countDocuments();
    const _res = {take, skip, total: _count};
    const _musicsList = await baseReadDirController(baseUrl, `mp3s`);

    baseController.list = _model;
    baseController.pages = _res;
    baseController.extras = _musicsList[Math.floor(Math.random() * _musicsList.length)];

    return baseController;
  }
}

const _getByTitle = {
  type: baseRes.baseResponse('storyByTitle', new GraphQLList(storyType)),
  args: {
    ...basePage,
    query: { type: GraphQLString },
  },
  resolve: async(root, args) => {
    const limit = 5;
    const _res = {total: limit};
    const _model = await model.find({ $text: { $search: args.query } })
      .populate('category')
      .populate('created_by')
      .limit(limit)
      .exec();
    
    // re-init the file download
    const _newModel = _model.map(async(n) => {
      n.file = await baseCloudGenerateLinkController(n.file);
      return n;
    });
    //
    baseController.list = _newModel;
    baseController.pages = _res;

    return baseController;
  }
}

const _add = {
  type: storyType,
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    file: { type: GraphQLUpload },
    category: { type: GraphQLString },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    return baseProccessController(async() => {
      const { filename, mimetype, createReadStream } = await args.file;
      const stream = createReadStream();
      const file = await baseUploadController({stream, filename}, 'stories');

      args.created_by = Types.ObjectId(args.created_by);
      args.file = file.locationFile;
      const _model = new model(args);
      const _newModel = await _model.save();
      //
      return _newModel;
    });
  }
}

// firebase upload
const _addToCloud = {
  type: storyType,
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    file: { type: GraphQLUpload },
    category: { type: GraphQLString },
    created_by: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    return baseProccessController(async() => {
      const { filename, mimetype, createReadStream } = await args.file;

      const stream = createReadStream();
      const file = await baseUploadController({stream, filename}, 'stories');
      const firebase = await baseCloudUploadController(file.locationFile, 'stories');
      //
      args.created_by = Types.ObjectId(args.created_by);
      args.file = file.locationFile;
      const _model = new model(args);
      const _newModel = await _model.save();
      //
      return _newModel;
    });
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
    return baseProccessController(async() => {
      const _model = model.findByIdAndRemove(args._id);

      baseRemoveController(_model.file);
      return _model;
    });
  }
}

const _deleteFromCloud = {
  type: storyType,
  args: {
    _id: { type: GraphQLString }
  },
  resolve: async(root, args) => {
    return baseProccessController(async() => {
      const _model = await model.findByIdAndRemove(args._id);
      // remove from cloud
      const firebase = await baseCloudRemoveController(_model.file);

      return _model;
    })
  }
}

module.exports = {
  getStories: _getAll,
  getStoryByCategory: _getByCategory,
  getStoryByTitle: _getByTitle,
  getStory: _getById,
  addStory: _add,
  addStoryToCloud: _addToCloud,
  updateStory: _update,
  removeStory: _delete,
  removeStoryFromCloud: _deleteFromCloud
}
