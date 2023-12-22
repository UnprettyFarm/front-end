import React, { Fragment, useEffect } from "react";
import { NavLink, Link, Form } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import logo from "../../assets/logo.png";
import axios from "axios";

import style from "./MainNavigation.module.css";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { isErrorModalAtom, tokenAtom, userInfoAtom } from "../../recoil/Atoms";
import * as API from "../../api";

const MainNavigation = (props) => {
  const [token, setToken] = useRecoilState(tokenAtom);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [, setIsErrorModal] = useRecoilState(isErrorModalAtom);

  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     setToken(localStorage.getItem('token'));

  //   }
  // }, []);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        console.log("getUserInfotoken", token);
        //로컬 로그인을 했을 경우 실행
        if (token && !userInfo) {
          const response = await API.get("/user/userInfo", token);
          setUserInfo(response.data);
          console.log("헤더", response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUserInfo();
  }, [token]);

  const logoutHandler = () => {
    try {
      if (token) {
        //localStorage.removeItem('token');
        localStorage.removeItem("expiration");
        setUserInfo("");
        setToken("");
        window.location.href = "/";
      } else {
        setIsErrorModal({
          state: true,
          message: "로그아웃에 실패하였습니다.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <header className={style.header}>
        <nav className={style.left}>
          <ul className={style.list}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? style.active : undefined
                }
              >
                <img src={logo} alt="unpretty-farm " />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/matching"
                className={({ isActive }) =>
                  isActive ? style.active : undefined
                }
              >
                못난이 매칭
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/findfarmer"
                className={({ isActive }) =>
                  isActive ? style.active : undefined
                }
              >
                파머 찾기
              </NavLink>
            </li>
            {token && (
              <li>
                <NavLink
                  to="/mypage"
                  className={({ isActive }) =>
                    isActive ? style.active : undefined
                  }
                >
                  마이 페이지
                </NavLink>
              </li>
            )}
            {/* token && userInfo && userInfo.farmerId!==null */}
            {token && (
              <li>
                <NavLink
                  to="/farmerpage/requestlist"
                  className={({ isActive }) =>
                    isActive ? style.active : undefined
                  }
                >
                  파머 페이지
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <nav>
          <ul className={style.list}>
            <li>{token && <span>{userInfo?.userName} 님</span>}</li>
            <li>
              {!token ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className={style.button}
                >
                  <Link to="/login">로그인</Link>
                </motion.button>
              ) : (
                <Form action="/logout">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className={style.button}
                    onClick={logoutHandler}
                  >
                    로그아웃
                  </motion.button>
                </Form>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </Fragment>
  );
};

export default MainNavigation;
