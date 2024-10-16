import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";

function LandingPage() {
  const navigate = useNavigate();

  //LandingPage에 들어오자 마자 실행함
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  const onClickLogoutHandler = (e) => {
    axios
      .get("/api/users/logout")
      .then(() => navigate("/login"))
      .catch(() => alert("로그아웃 에러"));
  };

  return (
    <div
      style={{
        display: "flex",
        // flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={onClickLogoutHandler}>로그아웃</button>
    </div>
  );
}

export default Auth(LandingPage, null);
