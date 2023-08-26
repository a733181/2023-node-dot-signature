import signature from '../models/signature.js';
import showError from './error.js';

export const create = async (req, res) => {
  try {
    await users.create({
      userId: req.user._id,
      signature: req.body.signature,
    });
    res.status(200).json({ success: true, message: '' });
  } catch (error) {
    showError(error, res);
  }
};

export const query = async (req, res) => {
  try {
    const result = await signature
      .find({ userId: req.user._id, status: { $ne: 1 } })
      .sort({ createDate: -1 });

    if (!result) {
      res.status(400).json({ success: false, message: '找不到資料' });
    }

    res.status(200).json({ success: true, message: '', data: result });
  } catch (error) {
    showError(error, res);
  }
};

export const del = async (req, res) => {
  try {
    const result = await signature.findById(req.body.id);

    if (!result) {
      res.status(400).json({ success: false, message: '找不到資料' });
    }

    result.status = 1;
    await result.save();

    res.status(200).json({ success: true, message: '' });
  } catch (error) {
    showError(error, res);
  }
};
