import passport from 'passport';
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import users from '../models/users.js';

passport.use(
  'login',
  new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await users.findOne({ email });
        if (!user) {
          return done(null, false, { message: '帳號不存在' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: '密碼錯誤' });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  'jwt',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
      ignoreExpiration: true,
    },
    async (req, payload, done) => {
      const token = req.headers.authorization.split(' ')[1];

      const expired = payload.exp * 1000 < Date.now();

      if (
        expired &&
        req.originalUrl !== '/users/extend' &&
        req.originalUrl !== '/users/logout'
      ) {
        return done(null, false, { message: '登入逾時' });
      }
      try {
        const user = await users.findOne({ _id: payload._id, tokens: token });
        if (user) {
          return done(null, { user, token });
        }
        return done(null, false, { message: '使用者不存在或 JWT 無效' });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
