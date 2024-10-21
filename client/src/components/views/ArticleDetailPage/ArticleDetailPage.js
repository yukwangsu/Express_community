import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Auth from "../../../hoc/auth";
import User_sample_image from "../../../assets/user_sample_image.png";
import { MessageSquare, ThumbsUp } from "lucide-react";

function ArticleDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  //landing화면에서 클릭한 article의 id 불러오기
  const articleId = location.state?.articleId;
  //새 댓글 작성
  const [Comment, setComment] = useState("");
  //article 세부 정보 불러오기
  const [article, setArticle] = useState(null);
  //article에 작성된 댓글 불러오기
  const [articleComment, setArticleComment] = useState(null);

  // Page에 들어오자마자 실행
  useEffect(() => {
    // 게시글 불러오기
    console.log(articleId);
    const body = { _id: articleId };
    axios
      .post("/api/articles/find", body)
      .then((response) => {
        setArticle(response.data);
      })
      .catch((err) => {
        alert("Error 게시글을 불러올 수 없습니다.");
        console.log(err);
      });

    // 댓글 불러오기
    const body2 = { articleId: articleId };
    axios
      .post("/api/articles/load/comment", body2)
      .then((response) => {
        setArticleComment(response.data);
      })
      .catch((err) => {
        alert("Error 댓글을 불러올 수 없습니다.");
        console.log(err);
      });
  }, [articleId]);

  const onClickLogoutHandler = (e) => {
    axios
      .get("/api/users/logout")
      .then(() => navigate("/login"))
      .catch(() => alert("로그아웃 에러"));
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

  const onCommentHandler = (e) => {
    setComment(e.target.value);
  };

  const onAddCommentHandler = (e) => {
    e.preventDefault();
    if (Comment.length === 0) {
      return;
    }
    const body = { articleId: articleId, content: Comment };
    const body2 = { _id: articleId };
    axios
      .post("/api/articles/add/comment", body)
      .then(() => {
        setComment("");
        //댓글 개수가 올라가기 때문에 article을 디비에서 다시 가져와서 업데이트 해줌
        axios
          .post("/api/articles/find", body2)
          .then((response) => {
            setArticle((prev) => ({
              ...prev,
              commentCnt: response.data.commentCnt,
            }));
          })
          .catch((err) => {
            console.log(err);
            alert("Error article을 디비에서 다시 가져와서 업데이트 실패.");
          });

        // 댓글 다시 불러오기
        const body3 = { articleId: articleId };
        axios
          .post("/api/articles/load/comment", body3)
          .then((response) => {
            setArticleComment(response.data);
          })
          .catch((err) => {
            alert("Error 댓글을 불러올 수 없습니다.");
            console.log(err);
          });
        // 0.5초 뒤에 화면 아래로 이동
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth", // 부드럽게 이동
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="detail-page">
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
        <div className="detail-main">
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
          <div className="detail-sub-info">
            <div className="detail-sub-info-vote">
              <ThumbsUp size={20} color="red" />
              <div>{article ? article.like : "."}</div>
            </div>
            <div className="detail-sub-info-comment">
              <MessageSquare size={20} color="#05BCBC" />
              <div>{article ? article.commentCnt : "."}</div>
            </div>
          </div>
          <button className="detail-vote-button" onClick={onClickLikeHandler}>
            <ThumbsUp size={19} color="#737373" />
            공감
          </button>
        </div>

        <hr className="detail-line" />

        <div className="detail-comment-back">
          <div className="detail-comments">
            {articleComment
              ? articleComment.map((element) => (
                  <ListArticleComment key={element._id} item={element} />
                ))
              : ""}
          </div>

          <form onSubmit={onAddCommentHandler}>
            <input
              className="detail-input-comment"
              value={Comment}
              onChange={onCommentHandler}
              placeholder="댓글을 입력하세요"
            ></input>
            <button className="detail-add-comment-button" type="submit">
              댓글등록
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ListArticleComment({ item }) {
  return (
    <div className="detail-comment">
      <div className="detail-comment-user-info">
        <div className="detail-comment-user-image">
          <img src={User_sample_image} alt="user_sample_image" />
        </div>
        <div className="detail-comment-user-name">{item.writerName}</div>
      </div>
      <div className="detail-comment-content">{item.content}</div>
      <div className="detail-comment-time">{formatDate(item.createdAt)}</div>
      <hr />
    </div>
  );
}

function formatDate(isoString) {
  const date = new Date(isoString); // ISO 문자열을 Date 객체로 변환
  const now = new Date(); // 현재 시간 가져오기

  // 날짜 부분만 비교하기 위해 년, 월, 일을 추출
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    // 1. 글이 올라온지 한 시간도 안 됐다면 n분 전으로 표시
    const inOneHour =
      date.getHours() === now.getHours() ||
      (date.getHours() + 1 === now.getHours() &&
        date.getMinutes() > now.getMinutes());
    if (inOneHour) {
      var m = now.getMinutes() - date.getMinutes();
      if (m === 0) {
        // 2. 글이 방금 올라왔다면(1분도 지나지 않았을 때)
        return "방금";
      }
      if (m < 0) {
        m += 60;
      }
      const mm = m.toString();
      return `${mm}분 전`;
    }
  }
  // 3. 한시간 이상 지났다면 날짜와 시간 모두 표시
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}`;
}

export default Auth(ArticleDetailPage, true);
