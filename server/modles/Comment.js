const mongoose = require("mongoose");

const commentSchma = mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 500,
      required: true,
    },
    articleId: { type: String, required: true },
    authorId: { type: String, required: true },
    writerName: { type: String, required: true },
  },
  { timestamps: true }
);

//모델의 이름: User, 스키마: userSchma
const Comment = mongoose.model("Comment", commentSchma);

//모델을 다른 곳에서 사용하기 위해 exports함.
module.exports = { Comment };
