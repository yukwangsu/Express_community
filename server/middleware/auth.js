const { User } = require("../modles/User");

function auth(req, res, next) {
  //인증 처리를 하는 곳

  //클라이언트 쿠키에서 토큰을 가져온다
  const token = req.cookies.x_auth;

  //토큰을 복호화 한후 유저를 찾는다.
  User.findByToken(token)
    .then((user) => {
      if (!user) {
        throw new Error("invailed token");
      }
      req.token = token;
      req.user = user;
      //미들웨어에서 나감 ,auth,
      next();
    })
    .catch((err) => {
      return res.status(401).json({ isAuth: false, message: err.message });
    });

  //유저가 있으면 인증 Okay

  //유저가 없으면 인증 No
}

module.exports = { auth };
