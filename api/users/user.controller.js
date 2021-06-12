const { genSaltSync, hashSync, compareSync } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { create, getUsers, getUserById, updateUser, deleteUser, getUserByEmail } = require('./user.service');

module.exports = {
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
  updateUser: (req, res) => {
    const body = req.body;
    const { id } = req.params;
    body.id = id;

    if(body.password) {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
    }

    updateUser(body, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error',
        });
      }
      else if(results.affectedRows !== 1) {
        return res.status(500).json({
          success: 0,
          message: 'Data not found',
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  deleteUser: (req, res) => {
    const { id } = req.params;

    deleteUser(id, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error',
        });
      }
      else if(results.affectedRows !== 1) {
        return res.status(500).json({
          success: 0,
          message: 'Data not found',
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    })
  },

  login: (req, res) => {
    const { email, password } = req.body;
    getUserByEmail(email, (err, results) => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: 'Database Connection Error',
        });
      }
      else if(!results) {
        console.log('results', results);
        return res.status(500).json({
          success: 0,
          message: 'Invalid Email',
        });
      }
      if(!password) {
        return res.status(500).json({
          success: 0,
          message: 'Password is required',
        });
      }
      const comparePass = compareSync(password, results.password);
      if(comparePass) {
        results.password = undefined;
        const jsonToken = sign({ result: results }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });

        return res.status(200).json({
          success: 1,
          message: "Login Succesfully",
          data: jsonToken,
        });
      } else {
        return res.status(500).json({
          success: 0,
          message: 'Invalid Password',
        });
      }
    });
  },
}