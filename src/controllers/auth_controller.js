const authModel = require('../models/auth_model')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;

const authController = {
    login: (req, res) => {
        return authModel
          .login(req.body)
          .then((result) => {
            jwt.sign(
              { user_id: result.user_id, role: result.role },
              JWT_PRIVATE_KEY,
              (err, token) => {
                return res.status(200).send({
                  message: "success",
                  data: {
                    token,
                    user: result,
                  },
                });
              }
            );
          })
          .catch((error) => {
            return res.status(500).send({ message: error });
          });
      },

      register: (req, res) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({ message: err.message });
          } else {
            const request = {
              email: req.body.email,
              phone: req.body.phone,
              password: hash,
            };
            return authModel
              .register(request)
              .then((result) => {
                return res.status(201).send({ message: "success", data: result });
              })
              .catch((error) => {
                return res.status(500).send({ message: error });
              });
          }
        });
      },
    
}

module.exports = authController