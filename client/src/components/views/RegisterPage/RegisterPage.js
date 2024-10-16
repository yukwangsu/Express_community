import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth";

function RegisterPage(props) {
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [PasswordCheck, setPasswordCheck] = useState("");
  const navigate = useNavigate();

  const onNameHandler = (e) => {
    setName(e.target.value);
  };
  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };
  const onPasswordCheckHandler = (e) => {
    setPasswordCheck(e.target.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();

    //비밀번호 확인을 통과했을 경우
    if (Password === PasswordCheck) {
      let body = {
        name: Name,
        email: Email,
        password: Password,
      };
      axios
        .post("/api/users/register", body)
        .then(() => navigate("/login"))
        .catch((e) => {
          alert("Error");
          console.log(e);
        });
    }
    //비밀번호 확인을 통과하지 못 했을 경우
    else {
      alert("동일한 비밀번호를 입력해주세요.");
    }
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
        <label>Name</label>
        <input type="name" value={Name} onChange={onNameHandler} />
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <label>confirm password</label>
        <input
          type="password"
          value={PasswordCheck}
          onChange={onPasswordCheckHandler}
        />
        <br />

        <button type="submit">SignUp</button>
      </form>
    </div>
  );
}

export default Auth(RegisterPage, false);
