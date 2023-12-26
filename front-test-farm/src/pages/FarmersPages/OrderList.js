import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './style/QuotStatus.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { tokenAtom } from '../../recoil/Atoms'; //리코일 
import { useRecoilValue } from 'recoil'; // 리코일
import * as API from '../../api/index';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const OrderList = () => {
  const token = useRecoilValue(tokenAtom); //리코일
  const [ordList, setOrdList] = useState([]);
  const [farmerId, setFarmerId] = useState(1);
  const [type, setType] = useState('매칭'); // 1: 매칭, 2: 주문
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    allPage: 1,
    curPage: 1,
    startPage: 1,
    endPage: 0,
  });

  const [isOpen, setIsOpen] = useState(false); // 발송 Modal

  const key = ""; // 택배 API key
  const [company, setCompany] = useState([]); // 택배사 데이터 저장
  const [code, setCode] = useState("00"); // 택배사 코드 저장
  const [name, setName] = useState(); // 택배사 명 저장
  const [invoice, setInvoice] = useState(); // 송장 번호 저장

  const testFunction = async() => {
    try {
      const response = await API.get(`/farmer/orderlist/${type}/${page}`, token);
      const data = response.data;
      setOrdList([...data.ordersList]);
      const response2 = await API.get(`/companylist`, token);
      const com = response2.data;
      setCompany(...com);

      console.log(data.ordersList);
    } catch(error) {
      console.error('Error fetching data:', error);
    }
  }
  // 배송 현황(매칭) 리스트
  useEffect(() => {
    testFunction()
  }, [page]);

  const onChangePage = (_, value) => {
    setPage(value);
  };

    const changeType = async (selType) => { // 필터 변경
      if (selType === type) {
        alert("이미 선택");
      } else {
        try {
          setType(selType);
          let type = selType;
          let page = 1;
          const response = await API.get(`/farmer/orderlist/${type}/${page}`, token);
          const data = response.data;

          setOrdList([...data.ordersList]);
          setPageInfo(data.pageInfo);
        } catch(error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    const [ordersId, setOrdersId] = useState();
    const [product, setProduct] = useState();
    const [quantity, setQuantity] = useState();
    // Modal 관련
    const onClickButton = (receiptId, product, quantity) => {
      // console.log(ordersId, product, quantity);
      setIsOpen(true);

      setOrdersId(receiptId);
      setProduct(product);
      setQuantity(quantity);
    };

    const openModal = () => {
      setIsOpen(true);
    };

    const closeModal = () => {
      setIsOpen(false);
    };

    const handleOutsideClick = (event) => { // Modal 외부 클릭 닫기
      if (event.target === event.currentTarget) {
        closeModal();
      }
    };

    const handleSelect = (e) => { // 택배 코드 
      setCode(e.target.value);
      setName(e.target.options[e.target.selectedIndex].getAttribute('data-name'))
    }

    const handleInvoice = (e) => { // 송장 번호
      // setInvoice(String(e.target.value));
      setInvoice(e.target.value);
    }

    const sendparcel = async (ordersId) => { // 발송 함수
      try {
        if (code === "00") {
          alert("택배사를 선택해주세요.");
        } else {
          console.log(ordersId);
          console.log(code);
          console.log(name);
          console.log(invoice);
          const response = await API.get(`/farmer/sendparcel/${ordersId}/${code}/${name}/${invoice}`, token);
          const data = response.data;
          alert(data);
          console.log(data);
          setCode("00");
          setInvoice("");
          setIsOpen(false);
            // 페이지 다시 요청
        }
      } catch(error) {
          alert(error.data);
          console.error('Error fetching data:', error);
      }
    }

    return (
      <div>
        <div className="quotation-status-header">
          <div className='warning-text'>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <ellipse cx="10.2691" cy="10.5273" rx="9.72222" ry="10" fill="#49680D" />
            <text x="50%" y="50%" textAnchor='middle' dy=".3em" fill="#fff" fontSize="12">
              !
            </text>
          </svg>
          <span>
            &nbsp;배송 완료 된 견적서는 배송 현황에서 볼 수 있습니다!
          </span>
        </div>
          <div className="state-dropdown">
            <button className="state-dropbtn">
              {type}
            </button>
            <div className="state-dropdown-content">
              <a href="#" key="1" onClick={() => changeType('매칭')}>매칭</a>
              <a href="#" key="2" onClick={() => changeType('주문')}>주문</a>
            </div>
          </div>
        </div>
        <TableContainer component={Paper}>
        <Table sx={{ backgroundColor: '#fefcf4' }} className='quot-list' aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">&nbsp;</TableCell>
              <TableCell align="right">주문번호</TableCell>
              <TableCell align="right">농산물</TableCell>
              <TableCell align="right">가격</TableCell>
              <TableCell align="right">수량&nbsp;</TableCell>
              <TableCell align="right">받는이&nbsp;</TableCell>
              <TableCell align="right">연락처&nbsp;</TableCell>
              <TableCell align="right">주소&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordList.length > 0 && ordList.map(ord => (
              <TableRow key={ord.ordersId}>
                <TableCell>
                  <button className="quotation-delete-btn" onClick={() => onClickButton(ord.ordersId, ord.product, ord.quantity)}>발송</button>
                </TableCell>
                <TableCell align="right">
                  <Link to={`orderdetail/${ord.ordersId}/${type}`}>
                    {ord.ordersId}
                  </Link>
                </TableCell>
                <TableCell align="right">{ord.product}</TableCell>
                <TableCell align="right">{ord.quantity}</TableCell>
                <TableCell align="right">{ord.price}</TableCell>
                <TableCell align="right">{ord.name}</TableCell>
                <TableCell align="right">{ord.tel}</TableCell>
                <TableCell align="right">{ord.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        {isOpen && (<div id="myModal" className="modal" onClick={handleOutsideClick}>
          {/* 모달 내용 */}
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>발송 입력</h2>
            <p>주문 번호 : {ordersId}</p>
            <p>품 목 :{product}</p>
            <p>수 량 :{quantity}</p>
            <div>
              택 배 사 :
              <select name="tcode" onChange={handleSelect}>
                <option value="00" selected>선택</option>
                {company.length > 0 && company.map(com => (
                  <option key={com.code} value={com.code} data-name={com.name}>{com.name}</option>
                )
                )}
              </select>
            </div>
            <p>송장 번호 : <input type='text' value={invoice} onChange={handleInvoice} /></p>
            <button onClick={() => sendparcel(ordersId)}>발송</button>
          </div>
        </div>
        )}
        <div className={style.pagination}>
        <Stack spacing={2}>
          <Pagination
            className={style.Pagination}
            count={pageInfo?.allPage}
            page={pageInfo?.curPage}
            onChange={onChangePage}
            size="small"
          />
        </Stack>
      </div>
      </div>
    );
  }

export default OrderList;
