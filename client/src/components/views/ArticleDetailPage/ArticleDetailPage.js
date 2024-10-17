import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "../../../hoc/auth";
import User_sample_image from "../../../assets/user_sample_image.png";
import { ThumbsUp } from "lucide-react";

function ArticleDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const articleId = location.state?.articleId;
  const [article, setArticle] = useState(null);

  // Page에 들어오자마자 실행
  useEffect(() => {
    // 게시글 불러오기

    console.log(articleId);

    const body = { _id: articleId };
    axios
      .post("/api/articles/find", body)
      .then((response) => {
        setArticle(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        alert("Error 게시글을 불러올 수 없습니다.");
        console.log(err);
      });
  }, [articleId]);

  const onClickLogoutHandler = (e) => {
    axios
      .get("/api/users/logout")
      .then(() => navigate("/login"))
      .catch(() => alert("로그아웃 에러"));
  };

  const onClickPostingHandler = (e) => {
    navigate("/posting");
  };

  const onClickLikeHandler = () => {
    const body = { _id: articleId };

    axios
      .post("/api/articles/like", body)
      .then(() => {
        axios
          //좋아요를 누르면 개수가 올라가기 때문에 article을 디비에서 다시 가져와서 업데이트 해줌
          .post("/api/articles/find", body)
          .then((response) => {
            setArticle((prev) => ({ ...prev, like: response.data.like }));
          })
          .catch((err) => {
            console.log(err);
            alert("Error article을 디비에서 다시 가져와서 업데이트 실패.");
          });
      })
      .catch((err) => {
        console.log(err);
        alert("좋아요 Error");
      });
  };

  return (
    <div className="landing-page">
      <div className="nav-bar">Pangsu 커뮤니티</div>

      <ul className="menu">
        <li>
          <a href="">MENU</a>
          <ul className="submenu">
            <li>
              <a
                href=""
                onClick={() => {
                  onClickLogoutHandler();
                }}
              >
                로그아웃
              </a>
            </li>
            <li>
              <a href="">내가 쓴 글</a>
            </li>
          </ul>
        </li>
      </ul>

      <div className="detail-back">
        <div className="detail-info">
          <div className="detail-user-image">
            <img src={User_sample_image} alt="user_sample_image" />
          </div>
          <div className="detail-info-user">
            <div className="detail-user-name">
              {article ? article.writer : "Loading..."}
            </div>
            <div className="detail-time">
              {article ? formatDate(article.createdAt) : "Loading..."}
            </div>
          </div>
        </div>
        <div className="detail-title">
          {article ? article.title : "Loading..."}
        </div>
        <div className="detail-content">
          {article ? article.content : "Loading..."}
        </div>
        <div>
          <ThumbsUp size={20} color="red" />
        </div>
        <div>{article ? article.like : "."}</div>
        <button onClick={onClickLikeHandler}>공감하기</button>
      </div>

      <div className="post-button-back">
        <button className="post-button" onClick={onClickPostingHandler}>
          댓글 작성하기?
        </button>
      </div>
    </div>
  );
}

function formatDate(isoString) {
  const date = new Date(isoString); // ISO 문자열을 Date 객체로 변환

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}`;
}

export default Auth(ArticleDetailPage, true);
