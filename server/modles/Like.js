const mongoose = require("mongoose");

const likeSchma = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  articleId: {
    type: String,
    required: true,
  },
});

//모델의 이름: User, 스키마: userSchma
const Like = mongoose.model("Like", likeSchma);

//모델을 다른 곳에서 사용하기 위해 exports함.
module.exports = { Like };
