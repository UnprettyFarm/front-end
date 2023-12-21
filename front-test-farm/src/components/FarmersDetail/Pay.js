import React, { useState, useEffect } from "react";
import { importIamport, userCode } from "../../api/iamport";
import { useLocation } from "react-router-dom"; // useLocation 불러오기
import axios from "axios";
import * as API from "../../api/index";

const Pay = () => {
  const location = useLocation();
  const { state } = location;

  const productPrice = parseInt(state.deliveryInfo.productPrice, 10);
  const quantity = parseInt(state.deliveryInfo.quantity, 10);
  const productQuantity = parseInt(state.deliveryInfo.productQuantity, 10);
  const productStock = state.deliveryInfo.stock;
  const [result, setResult] = useState(0); // result 상태 정의

  useEffect(() => {
    if (!isNaN(productPrice) && !isNaN(quantity)) {
      const calculatedResult = productPrice * quantity;
      setResult(calculatedResult); // result 상태 업데이트
    } else {
      console.log("올바른 숫자 형식이 아닙니다.");
    }
  }, [productPrice, quantity]);
  console.log("result", result);
  const [paymentInfo, setPaymentInfo] = useState({
    pg: "html5_inicis",
    pay_method: "card",
    name: state.deliveryInfo.productName,
    amount: parseInt(
      state.deliveryInfo.productPrice * state.deliveryInfo.quantity
    ),
    merchant_uid: `mid_${new Date().getTime()}`,
    buyer_name: state.deliveryInfo.name,
    buyer_tel: state.deliveryInfo.tel,
    buyer_address: state.deliveryInfo.address,
  });
  const preInfo = {
    receiptId: paymentInfo.merchant_uid,
    amount: paymentInfo.amount,
    buyerName: paymentInfo.buyer_name,
    buyerAddress: paymentInfo.buyer_address,
    buyerTel: paymentInfo.buyer_tel,
  };

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);
  const requestPay = async () => {
    console.log("quantity:", quantity);
    console.log("productStock:", productStock);

    if (quantity > productStock) {
      alert("상품 수량을 확인해주세요.");
      return;
    }
    try {
      const { IMP } = window;
      IMP.init(userCode);

      IMP.request_pay(paymentInfo, async (rsp) => {
        console.log(rsp);

        if (rsp.success) {
          try {
            const response = await API.post2(`/processPayment`, {
              receiptId: rsp.imp_uid,
              amount: rsp.paid_amount,
              ordersId: rsp.merchant_uid,
              buyerName: rsp.buyer_name,
              buyerTel: rsp.buyer_tel,
              buyerAddress: rsp.buyer_address,
              paymentMethod: rsp.pay_method,
              pgTid: rsp.pg_tid,
              pgType: rsp.pg_type,
              status: rsp.status,
              paidAt: rsp.paid_at,
              productName: rsp.name,
              productPrice: productPrice,
              count: quantity,
              productId: state.deliveryInfo.productId,
              farmerId: state.deliveryInfo.farmerId,
            });

            alert(response.data);
          } catch (error) {
            console.error("Error while processing payment:", error);
            alert("Payment processing failed");
          }
        } else {
          alert("Payment failed");
        }
      });
    } catch (error) {
      console.error("Error occurred during payment:", error);
      alert("Error occurred during payment");
    }
  };

  return (
    <>
      <div>checkoutpage</div>
      <div>상품명: {state.deliveryInfo.productName}</div>
      <div>상품가격: {state.deliveryInfo.productPrice}</div>
      <div>수령인 이름: {state.deliveryInfo.name}</div>
      <div>수령인 전화번호: {state.deliveryInfo.tel}</div>
      <div>수령 주소: {state.deliveryInfo.address}</div>
      <div>수량: {state.deliveryInfo.quantity}</div>
      재고량: {state.deliveryInfo.stock}
      <div>
        총 금액: {state.deliveryInfo.productPrice * state.deliveryInfo.quantity}{" "}
        원
      </div>
      <button onClick={requestPay}>결제하기</button>
    </>
  );
};
export default Pay;
