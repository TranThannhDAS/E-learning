import { useEffect, useState } from "react";
import "./index.css";
import { cartServices } from "@eproject4/services/cart.service";
import { getUser } from "@eproject4/helpers/authHelper";
import useCustomSnackbar from "@eproject4/utils/hooks/useCustomSnackbar";
import { useDispatch } from "react-redux";
import { setShoppingCartRender } from "@eproject4/redux/slices/orderSlide";
import { OrderPaid } from "@eproject4/services/order.service";
import LoadingBackdrop from "@eproject4/components/LoadingBackdrop";

const CheckoutCart = () => {
  const { GetCardByUserID, DeleteCart, loading: cartLoading } = cartServices();
  const { createOrder, loading: orderLoading } = OrderPaid();
  const [data, setData] = useState([]);
  const { showSnackbar } = useCustomSnackbar();
  const dispatch = useDispatch();
  const [render, setRender] = useState(0);

  useEffect(() => {
    fetchData();
  }, [render]);

  const fetchData = async () => {
    try {
      var checkUser = getUser();
      const res = await GetCardByUserID(checkUser.id);
      setData(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const handleDelete = async (sourceId) => {
    try {
      var checkUser = getUser();
      const res = await DeleteCart(sourceId, checkUser.id);
      console.log(res);
      if (res.status === 200) {
        showSnackbar("Xóa thành công", "success");

        setRender((prevRender) => prevRender + 1);

        dispatch(setShoppingCartRender({ status: true }));
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      showSnackbar("Xóa thất bại", "error");
    }
  };

  const handlePaid = async (price) => {
    var checkUser = getUser();
    const port = window.location.origin;
    const data = {
      UserID: checkUser.id,
      PortURLreturn: port,
      TotalPrice: price,
    };
    const response = await createOrder(data);
    console.log(response);
    if (response.status == 200) {
      window.location.href = response.data.paymentUrl;
    }
  };
  return (
    <div className="container">
      <LoadingBackdrop open={cartLoading || orderLoading} />
      <div className="left-column">
        <h1>Thanh toán</h1>
        <h2>Thông tin người dùng</h2>
        <input
          type="text"
          value={data.length > 0 ? data[0].username : ""}
          placeholder="Tên người dùng"
          disabled
        />
        <input
          type="email"
          value={data.length > 0 ? data[0].email : ""}
          placeholder="Email Address"
          disabled
        />
      </div>
      <div className="right-column">
        <h2>Courses ({data.length > 0 ? data[0].sources.length : 0})</h2>
        {data.length > 0 &&
          data[0].sources.map((item, index) => (
            <div className="flex2" key={index}>
              <div className="course">
                <img
                  src={
                    item.thumbnail
                      ? item.thumbnail
                      : "https://www.invert.vn/media/uploads/uploads/2022/12/03193534-2-anh-gai-xinh-diu-dang.jpeg"
                  }
                  alt="Course 2"
                />
                <div>
                  <h3>{item.sourceName}</h3>
                  <p>{item.price} VND</p>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(item.sourceID)}>
                Xóa
              </button>
            </div>
          ))}
        <div className="order-summary">
          <p>Tổng giá trị: {data.length > 0 ? data[0].totalPrice : 0} VND</p>
        </div>
        {data.length > 0 && (
          <button
            className="complete-payment"
            onClick={() => handlePaid(data[0].totalPrice)}>
            Thanh toán
          </button>
        )}{" "}
      </div>
    </div>
  );
};
export default CheckoutCart;
