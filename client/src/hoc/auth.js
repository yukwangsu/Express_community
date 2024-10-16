import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = (SpecificComponent, option, adminRoute = null) => {
  //option의 종류
  //null => 아무나 출입이 가능한 페이지
  // true => 로그인한 유저만 출입이 가능한 페이지
  // false => 로그인한 유저는 출입이 불가능한 페이지

  //adminRoute 관리자만 들어갈 수 있게하는지 설정
  //여기서는 =null을 사용하여 제외하고 진행
  function AuthenticationCheck(props) {
    const navigate = useNavigate();

    useEffect(() => {
      axios
        .get("/api/users/auth")
        .then((reponse) => {
          console.log(reponse);

          if (adminRoute && !reponse.isAdmin) {
            navigate("/");
          } else {
            if (option === false) {
              navigate("/");
            }
          }
        })
        .catch(() => {
          //auth가 실패했는데(토큰이 없는데) option이 true인 페이지에 접속하면
          // landing 페이지로 이동
          //auth가 실패했는데 option이 false인 페이지에 접속하면 그대로 이동.
          if (option) {
            navigate("/");
          }
        });
    });
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
};
export default Auth;
