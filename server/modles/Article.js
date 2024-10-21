const mongoose = require("mongoose");

const articleSchma = mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 100,
      required: true,
    },
    content: {
      type: String,
      maxlength: 500,
      required: true,
    },
    author: { type: String, required: true },
    writer: { type: String, required: true },
    like: { type: Number, default: 0 },
    commentCnt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//모델의 이름: User, 스키마: userSchma
const Article = mongoose.model("Article", articleSchma);

//모델을 다른 곳에서 사용하기 위해 exports함.
module.exports = { Article };
