const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const accountRouter = require('./routes/account');
const authRouter = require('./routes/auth');
const editRouter = require('./routes/edit');
const followRouter = require('./routes/follow');
const homeRouter = require('./routes/home');
const indexRouter = require('./routes/index');
const msgRouter = require('./routes/msg');
const newRouter = require('./routes/new');
const profileRouter = require('./routes/profile');

const { sequelize } = require('./models');

const app = express();

const passportConfig = require('./passport');
passportConfig();

app.set('port', process.env.PORT || 10016);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false })
.then(() => {
	console.log('데이터베이스 연결 성공');
})
.catch((err) => {
	console.error(err);
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/auth', authRouter);
app.use('/follow', followRouter);
app.use('/home', homeRouter);
app.use('/msg', msgRouter);
app.use('/new', newRouter);
app.use('/edit', editRouter);
app.use('/profile', profileRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
