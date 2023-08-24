import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();

const corsSet = {
  origin(origin, callback) {
    if (
      origin === undefined ||
      origin.includes('github') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true);
    } else {
      callback(new Error(), false);
    }
  },
  credentials: true,
};

app.use(cors(corsSet));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' });
});

app.use(express.json());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' });
});

app.all('*', (req, res) => {
  res.status(400).json({ success: false, message: '找不到' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});
