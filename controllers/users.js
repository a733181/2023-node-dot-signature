import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import users from '../models/users.js';
import showError from './error.js';

export const register = async (req, res) => {
  try {
    await users.create({
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json({ success: true, message: '' });
  } catch (error) {
    showError(error, res);
  }
};

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7 days',
    });
    req.user.tokens.push(token);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: '',
      result: {
        token,
        email: req.user.email,
      },
    });
  } catch (error) {
    showError(error, res);
  }
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.status(200).json({ success: true, message: '' });
  } catch (error) {
    showError(error, res);
  }
};

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex((token) => token === req.token);
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '7 days',
    });
    req.user.tokens[idx] = token;
    await req.user.save();
    res.status(200).json({ success: true, message: '', result: token });
  } catch (error) {
    showError(error, res);
  }
};

export const editUser = async (req, res) => {
  try {
    let repeatPassword = false;

    req.user.email = req.body.email || req.user.email;

    if (req.body?.password) {
      repeatPassword = bcrypt.compareSync(req.body.password, req.user.password);
    }

    if (req.body?.password && repeatPassword) {
      res.status(400).json({ success: false, message: '密碼重複' });
    } else {
      if (req.body?.password && req.body.password !== '') {
        req.user.password = req.body.password;
      }
      await req.user.save();

      res.status(200).json({
        success: true,
        message: '',
        result: {
          email: req.user.email,
        },
      });
    }
  } catch (error) {
    showError(error, res);
  }
};
