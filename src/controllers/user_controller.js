const userModel = require("../models/user_model");
const cloudinary = require('../../helper/cloudinary_config')

const userController = {
  get: async (req, res) => {
    let { search, display_name, sortBy, page = 1, limit = 5 } = req.query;
    let offset = (page - 1) * limit;

    try {
      const result = await userModel.get(
        search,
        display_name,
        sortBy,
        limit,
        offset
      );
      return res.status(200).send({
        message: "success",
        data: result,
        page,
        limit,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  },
  getById: (req, res) => {
    return userModel
      .getById(req.params.user_id)
      .then((result) => {
        res.status(200).send({ message: "success", data: result });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  },

  deleteById: (req, res) => {
    return userModel
      .deleteById(req.params.user_id)
      .then((result) => {
        res
          .status(200)
          .send({
            message: "data deleted",
            data: `deleted user id is ${req.params.user_id}`,
          });
      })
      .catch((err) => {
        res.status(500).send({ message: err });
      });
  },

  update: async (req, res) => {
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: `user_${req.params.user_id}`,
      public_id: `${req.params.user_id}_avatar`,
      width: 700,
      height: 700,
      crop: 'pad'
    })
    const request = {
      ...req.body,
      user_id: req.params.user_id,
      image: image.secure_url,
    }
    try {
      const result = await userModel.patch(request);
      res.status(201).send({ message: "success", data: result });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "error" });
    }
  },  
};
module.exports = userController;