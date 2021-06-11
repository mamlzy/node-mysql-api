const { genSaltSync, hashSync } = require('bcrypt');
const { create, getUsers, getUserById } = require('./user.service');

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    
    create(body, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error',
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error',
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserById: (req, res) => {
    const { id } = req.params;
    getUserById(id, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error',
        });
      }
      else if(!results) {
        return res.status(500).json({
          success: 0,
          message: 'Data Not Found',
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

}