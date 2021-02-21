'use strict'

const { GraphQLList, GraphQLString, GraphQLNonNull } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const model = require('../models/Slider');

const _getAll = {
  type: baseRes.baseResponse('allSlider', new GraphQLList(sliderType)),
  args: basePage,
  resolve: async(root, args) => {
    const take = 3;
    const skip = args.skip ?? 0;

    const _model = await model.find()
      .skip(skip)
      .limit(take)
      .sort({created_at: -1})
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
  type: baseRes.baseResponse('oneSlider', sliderType),
  args: { ...basePage, _id: { type: GraphQLString } },
  resolve: async(root, args) => {
    const _model = await model.findById(args._id).exec();
    //
    const _count = await model.findById(args._id).countDocuments();
    const _res = {take: _count, skip: 0, total: _count};

    baseController.list = _model;
    baseController.pages = _res;

    return baseController;
  }
}

const _add = {
  type: sliderType,
  args: {
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    image: { type: GraphQLUpload }
  },
  resolve: async(root, args) => {
    // upload process
    return baseProccessController(async() => {
      const { filename, mimetype, createReadStream } = await args.image;
      const stream = createReadStream();
      const file = await baseUploadController({stream, filename}, 'sliders');
      
      args.image = file.locationFile;
      const _model = new model(args);
      const _newModel = await _model.save();
      //
      return _newModel;
    });
  }
}

const _update = {
  type: sliderType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    image: { type: GraphQLUpload }
  },
  resolve: async(root, args) => {
    const _model = await model.findByIdAndUpdate(args._id, args, {new: true});
    //
    return _model;
  }
}

const _delete = {
  type: sliderType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async(root, args) => {
    return baseProccessController(async() => {
      const _model = await model.findByIdAndRemove(args._id);

      baseRemoveController(_model.image);
      return _model;
    });
  }
}

module.exports = {
  getSliders: _getAll,
  getSlider: _getById,
  addSlider: _add,
  updateSlider: _update,
  removeSlider: _delete
}
