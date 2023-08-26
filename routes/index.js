import signature from './signature.js';
import users from './users.js';

export default (app) => {
  app.use('/signature', signature);
  app.use('/users', users);

  app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Hello World!' });
  });
};
