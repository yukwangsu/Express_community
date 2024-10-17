import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";
import "../../../App.css";

function PostingPage(props) {
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");
  const navigate = useNavigate();

  const onTitleHandler = (e) => {
    setTitle(e.target.value);
  };
  const onContentHandler = (e) => {
    setContent(e.target.value);
  };
  const onPostingHandler = (e) => {
    e.preventDefault();

    //예외처리
    if (Title.length > 100) {
      alert("글 제목의 최대 길이는 100자입니다.");
      return;
    }
    if (Content.length > 500) {
      alert("글 내용의 최대 길이는 500자입니다.");
      return;
    }

    let body = {
      title: Title,
      content: Content,
    };

    axios
      .post("/api/articles/post", body)
      .then(() => {
        navigate("/");
        setTimeout(() => {
          alert("작성하신 글이 정상적으로 등록됐습니다.");
        }, 500);
      })
      .catch((e) => {
        alert("Error");
        console.log(e);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={onPostingHandler}
      >
        <label>title</label>
        <input type="title" value={Title} onChange={onTitleHandler} />
        <label>content</label>
        <textarea
          className="Post-content"
          value={Content}
          onChange={onContentHandler}
        />

        <br />

        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default Auth(PostingPage, true);
