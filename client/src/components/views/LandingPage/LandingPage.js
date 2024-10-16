import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";

function LandingPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

  // LandingPage에 들어오자마자 실행
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));

    // 인증된 유저인지 확인
    axios
      .get("/api/users/auth")
      .then(() => {
        setIsAuth(true);
      })
      .catch(() => {
        setIsAuth(false);
      });

    // 게시글 불러오기
    axios
      .get("/api/articles/load")
      .then((response) => {
        setArticles(response.data);
      })
      .catch(() => {
        alert("Error 게시글을 불러올 수 없습니다.");
      });
  }, []); // 빈 배열을 넣어서 컴포넌트 마운트 시에만 한 번 실행

  const onClickLogoutHandler = (e) => {
    axios
      .get("/api/users/logout")
      .then(() => navigate("/login"))
      .catch(() => alert("로그아웃 에러"));
  };

  const onClickLoginHandler = (e) => {
    navigate("/login");
  };

  const onClickPostingHandler = (e) => {
    navigate("/posting");
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
                onClick={isAuth ? onClickLogoutHandler : onClickLoginHandler}
              >
                {isAuth ? "로그아웃" : "로그인"}
              </a>
            </li>
            <li>
              <a href="">내가 쓴 글</a>
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="landing-page-title">게시글</h2>

      <div className="post-button-back">
        <button className="post-button" onClick={onClickPostingHandler}>
          글 작성하기
        </button>
      </div>

      <div className="article-back">
        {articles
          .slice()
          .reverse()
          .map((element) => (
            <ListElement key={element._id} item={element}></ListElement>
          ))}
      </div>
    </div>
  );
}

function ListElement({ item }) {
  return (
    <div className="article">
      <div className="article-title">{item.title}</div>
      <div className="article-second-line">
        <div className="article-content">{item.content}</div>
        <div className="article-info">
          {formatDate(item.createdAt) + " | " + item.writer}
        </div>
      </div>
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
    // 오늘이면 시간과 분을 반환
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    console.log(`${hours}:${minutes}`);
    return `${hours} : ${minutes}`;
  } else {
    // 오늘이 아니면 월과 일을 반환
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    console.log(`${month}-${day}`);
    return `${month}월 ${day}일`;
  }
}

export default Auth(LandingPage, null);
