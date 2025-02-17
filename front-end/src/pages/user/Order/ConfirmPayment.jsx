import { OrderPaid } from "@eproject4/services/order.service";
import { useEffect, useState } from "react";
import LoadingBackdrop from "@eproject4/components/LoadingBackdrop";
import { getUser } from "@eproject4/helpers/authHelper";
import { Container, Typography, CircularProgress, Box, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useDispatch } from "react-redux";
import { setShoppingCartRender } from "@eproject4/redux/slices/orderSlide";

const PaymentStatus = ({ success }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      {success ? (
        <Alert severity="success" iconMapping={{ success: <CheckCircleIcon fontSize="inherit" /> }}>
          <Typography variant="h4">
             Thanh toán thành công!
          </Typography>
          <Typography variant="body1">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được thanh toán thành công.</Typography>
        </Alert>
      ) : (
        <Alert severity="error" iconMapping={{ error: <ErrorIcon fontSize="inherit" /> }}>
          <Typography variant="h4">
            Thanh toán thất bại!
          </Typography>
          <Typography variant="body1">Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.</Typography>
        </Alert>
      )}
    </Box>
    );
};
export const ConfirmPayment = () => {
    const dispatch = useDispatch();
    const { confirmPayment, loading } = OrderPaid();
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const [success1 , setSuccess] = useState(false);
    useEffect(() => {
        console.log("vào đây123123");
            const fetchapi = async () => {
            const queryString = window.location.search;
            var checkUser = getUser();
    
            function parseQueryString(queryString) {
                const params = new URLSearchParams(queryString);
                const obj = {};
                for (const key of params.keys()) {
                    obj[key] = params.get(key);
                }
                obj.UserID = checkUser.id;
                return obj;
            }
    
            const dataFromQueryString = parseQueryString(queryString);
            const res = await confirmPayment(dataFromQueryString);
            if(res.data.message == "Success"){
                setPaymentSuccess(res.data.message);
                setSuccess(true);
            }else{
                setPaymentSuccess(res.data.message);
                setSuccess(false);
            }
            dispatch(setShoppingCartRender({ status: true }));
        }
        fetchapi();
    }, [])

    return (<>
        <LoadingBackdrop open={loading} />
        <Container>
        {paymentSuccess !== null ? (
            <div>
                <PaymentStatus success={success1} />
            </div>
        ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
              <Typography variant="h6" sx={{ marginLeft: 2 }}>Đang kiểm tra trạng thái thanh toán...</Typography>
            </Box>
        )}
        </Container>    
    </>)
}