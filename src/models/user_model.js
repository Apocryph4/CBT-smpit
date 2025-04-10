const db = require("../../helper/connection");
const { v4: uuidv4 } = require("uuid");

const userModel = {
  query: function (search, display_name, sortBy, limit, offset) {
    let orderQuery = `ORDER BY display_name ${sortBy} LIMIT ${limit} OFFSET ${offset}`;

    if (!search && !display_name) {
      return orderQuery;
    } else if (search && display_name) {
      return `WHERE display_name LIKE '%${search}%' AND display_name LIKE '${display_name}%' ${orderQuery}`;
    } else if (search || display_name) {
      return `WHERE display_name LIKE '%${search}%' OR display_name LIKE '${display_name}%' ${orderQuery}`;
    } else {
      return orderQuery;
    }
  },

  getDataAmount: () => {
    return new Promise((resolve, reject) => {
      db.query(`select count(*) from users`, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.rows);
        }
      });
    });
  },

  get: (search, display_name, sortBy = "ASC", limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from users ${userModel.query(
          search,
          display_name,
          sortBy,
          limit,
          offset
        )}`,
        (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.rows);
          }
        }
      );
    });
  },

  getById: (user_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `select * from users where user_id = '${user_id}'`,
        (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            console.log(user_id);
            resolve(result.rows);
          }
        }
      );
    });
  },

 

  patch: ({
    user_id,
    display_name,
    image,
    email,
    phone,
    delivery_address,
    first_name,
    last_name,
    birth,
    gender,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `select * from users where user_id = '${user_id}'`,
        (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            db.query(
              `UPDATE users SET display_name ='${
                display_name || result.rows[0].display_name
              }', email ='${email || result.rows[0].email}', phone ='${
                phone || result.rows[0].phone
              }', delivery_address ='${
                delivery_address || result.rows[0].delivery_address
              }',  image ='${image || result.rows[0].image}', first_name ='${
                first_name || result.rows[0].first_name
              }', last_name ='${
                last_name || result.rows[0].last_name
              }', gender ='${gender || result.rows[0].gender}', birth ='${
                birth || result.rows[0].birth
              }' WHERE user_id='${user_id}'`,
              (err, results) => {
                if (err) {
                  reject(err.message);
                } else {
                  resolve({
                    user_id,
                    display_name,
                    image,
                    email,
                    phone,
                    delivery_address,
                    first_name,
                    last_name,
                    birth,
                    gender,
                  });
                }
              }
            );
          }
        }
      );
    });
  },
};

module.exports = userModel;
