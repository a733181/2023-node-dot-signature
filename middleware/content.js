export default (type) => (req, res, next) => {
  if (
    !req.headers['content-type'] ||
    !req.headers['content-type'].includes(type)
  ) {
    res.status(200).json({ success: false, message: '格式錯誤' });
    return;
  }
  next();
};
