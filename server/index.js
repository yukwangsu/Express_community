const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./modles/User");
const { Article } = require("./modles/Article");
const { Like } = require("./modles/Like");

//application/x-www-form-urlencoded 타입으로 된 것을 분석해서 가져올 수 있게함.
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 타입으로 된 것을 분석해서 가져올 수 있게함.
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! nodemon added!!");
});

app.get("/hello", (req, res) => {
  res.send("안녕하세요 ~");
});

app.post("/users/register", (req, res) => {
  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user
    .save()
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.send(400).json({ success: false, msg: err }));
});

app.post("/users/login", (req, res) => {
  //요청된 이메일을 데이터베이스에 있는지 찾는다.
  //findOne: mongo db에서 제공하는 메소드
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      if (!user) {
        throw new Error("제공된 이메일에 해당하는 유저가 없습니다.");
      }
      const isMatch = await user.comparePassword(req.body.password);
      return { isMatch, user };
    })
    .then(({ isMatch, user }) => {
      if (!isMatch) {
        throw new Error("비밀번호가 틀렸습니다.");
      }
      return user.generateToken();
    })
    .then((user) => {
      return res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ loginSuccess: false, message: err.message });
    });
});

//middleware: auth 를 수행한 뒤 (req, res)=>{} 실행
app.get("/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 authentication 이 True라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(() => res.status(200).send({ success: true }))
    .catch((err) => res.json({ success: false, err }));
});

app.post("/articles/post", auth, (req, res) => {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
    writer: req.user.name,
  });
  article
    .save()
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json({ success: false, msg: err }));
});

app.get("/articles/load", (req, res) => {
  Article.find({})
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => res.json({ success: false, message: err.message }));
});

app.post("/articles/find", (req, res) => {
  Article.findOne({ _id: req.body._id })
    .then((article) => {
      if (!article) {
        throw new Error("can not find article.");
      } else {
        res.status(200).json(article);
      }
    })
    .catch((err) => {
      res.json({ success: false, message: err.message });
    });
});

app.post("/articles/like", auth, (req, res) => {
  Like.findOne({ userId: req.user._id, articleId: req.body._id })
    .then((history) => {
      if (!history) {
        const like = new Like({
          userId: req.user._id,
          articleId: req.body._id,
        });
        like
          .save()
          .then(() => {
            Article.findOneAndUpdate(
              { _id: req.body._id },
              { $inc: { like: 1 } }
            )
              .then(() => {
                res.status(200).json({ success: true });
              })
              .catch((err) => {
                res.status(500).json({ success: false, message: err.message });
              });
          })
          .catch((err) => {
            res.status(500).json({ success: false, message: err.message });
          });
      } else {
        Like.deleteOne({ userId: req.user._id, articleId: req.body._id })
          .then(() => {
            Article.findOneAndUpdate(
              { _id: req.body._id },
              { $inc: { like: -1 } }
            )
              .then(() => {
                res.status(200).json({ success: true });
              })
              .catch((err) => {
                res.status(500).json({ success: false, message: err.message });
              });
          })
          .catch((err) => {
            res.status(500).json({ success: false, message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
