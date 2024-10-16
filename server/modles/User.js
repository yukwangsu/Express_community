const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchma = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    //공백 제거
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  //토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

//mongoose 에서 가져온 메소드, save를 하기 전에 무엇을 실행한다.
userSchma.pre("save", function (next) {
  var user = this;
  //비밀번호가 변경되었을 때만
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킴
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchma.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchma.methods.generateToken = function () {
  const user = this;
  var token = jwt.sign(user._id.toJSON(), "secretToken");
  user.token = token;
  return user.save();
};

userSchma.statics.findByToken = function (token) {
  const user = this;

  //토큰을 decode 한다.
  var decoded = jwt.verify(token, "secretToken");
  //유저 아이디를 이용해서 유저를 찾은 다음에
  //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

  return user.findOne({ _id: decoded, token: token });
};

//모델의 이름: User, 스키마: userSchma
const User = mongoose.model("User", userSchma);

//모델을 다른 곳에서 사용하기 위해 exports함.
module.exports = { User };
