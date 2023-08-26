const showError = (error, res) => {
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: error.errors[Object.keys(error.errors)[0]].message,
    });
  } else if (error.code === 11000) {
    res.status(400).json({ success: false, message: '重複' });
  } else {
    res.status(500).json({ success: false, message: '未知錯誤' });
  }
};

export default showError;
