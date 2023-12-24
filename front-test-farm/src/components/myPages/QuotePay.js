import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tokenAtom, userInfoAtom } from './../../recoil/Atoms';
import { importIamport, userCode } from '../../api/iamport';
import * as API from '../../api/index';
import { useParams, useNavigate } from 'react-router-dom';

const QuotePay = ({ quoteItem }) => {
  const token = useRecoilValue(tokenAtom);
  const navigate = useNavigate();

  const quotationId = useParams().quotationId;
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  // const [paymentInfo, setPaymentInfo] = useState({
  //   pg: 'html5_inicis',
  //   pay_method: 'card',
  //   name: quoteItem.productName,
  //   merchant_uid: `mid_${new Date().getTime()}`, //orderId인것 같은데
  //   amount: parseInt(quoteItem.quote.quotationPrice), //실제 결제되는 가격
  //   buyer_name: userInfo.name, // 구매자 이름
  //   buyer_tel: userInfo.phone, // 구매자 전화번호
  //   buyer_email: userInfo.email, // 구매자 이메일
  //   buyer_addr: userInfo.address, // 구매자 주소
  // });

  const [quoteData, setQuoteData] = useState(null);
  useEffect(() => {
    console.log('dml??', quoteItem);
    const getQuote = async () => {
      try {
        const response = await API.get(`/user/request/${quotationId}`, token);
        console.log('quotepay', response);
        setQuoteData({ ...response.data });
      } catch (error) {
        console.log(error);
      }
    };

    getQuote();
  }, []);

  return (
    <div>
      <h2>Quote Detail</h2>
      {quoteData ? (
        <div>
          <p>Quotation ID: {quoteData.quote.id}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default QuotePay;
