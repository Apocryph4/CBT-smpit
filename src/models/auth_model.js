const { v4: uuidv4 } = require("uuid");
const db = require("../../helper/connection");
const bcrypt = require("bcrypt");

const authModel = {
  login: ({ email, password }) => {
    // console.log(username, password);
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email=$1`, [email], (err, result) => {
        //username = unique||email = unique
        if (err) return reject(err.message);
        if (result.rows.length == 0) return reject("email/password salah."); //ketika username salah
        bcrypt.compare(
          password,
          result.rows[0].password,
          (err, hashingResult) => {
            if (err) return reject(err.message); //kesalahan hashing(bycript)
            if (!hashingResult) return reject("email/password salah."); //ketika password salah
            return resolve(result.rows[0]);
          }
        );
      });
    });
  },

  register: ({ email, phone, password }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (user_id, email, password, phone, display_name) VALUES ('${uuidv4()}','${email}','${password}','${phone}', '${email}') RETURNING user_id`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          }
          return resolve({
            email,
            phone,
            password,
          });
        }
      );
    });
  },
};

module.exports = authModel;
