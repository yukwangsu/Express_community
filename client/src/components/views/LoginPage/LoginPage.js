import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";
// import { withRouter } from "react-router-dom";

function LoginPage(props) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };

    axios
      .post("/api/users/login", body)
      .then(() => navigate("/"))
      .catch((e) => {
        alert("아이디 혹은 비밀번호가 틀렸습니다.");
        console.log(e);
      });
  };
  const onRegisterHandler = (e) => {
    navigate("/register");
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
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <br />

        <button type="submit">Login</button>
      </form>
      <button className="register-button" onClick={onRegisterHandler}>
        계정이 없다면? SignUp
      </button>
    </div>
  );
}

export default Auth(LoginPage, false);
