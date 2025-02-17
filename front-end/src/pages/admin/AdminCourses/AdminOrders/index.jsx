import { getUser } from "@eproject4/helpers/authHelper";
import { getAllOrder } from "@eproject4/services/order.service";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { format } from "date-fns";

function AdminOrders({ handleOrderModalClose, openOrderModal, dataCourses }) {
  const userData = getUser();
  const { getAllOrderAction } = getAllOrder();
  const [orders, setOrders] = useState([]);
  const [orderOfCourse, setOrderOfCourse] = useState([]);

  const fetchDataAllOrders = async () => {
    const res = await getAllOrderAction();

    setOrders(res.data);
  };

  useEffect(() => {
    fetchDataAllOrders();
  }, [dataCourses]);

  useEffect(() => {
    const listOrders = orders?.filter((order) => {
      return order.souresID === dataCourses.id;
    });

    setOrderOfCourse(listOrders);
  }, [orders]);

  return (
    <Box>
      <Modal
        open={openOrderModal}
        onClose={handleOrderModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            overflowY: "auto",
            height: "700px",
            padding: "20px",
          }}>
          <Box>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
              Khoá học:{" "}
              <span className="font-[400]">
                {orderOfCourse[0]?.sourceTitle}
              </span>
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
              Giá tiền khoá học:{" "}
              <span className="font-[400]">
                {orderOfCourse[0]?.sourcePrice}
              </span>
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
              Số lượng học viên:{" "}
              <span className="font-[400]">
                {orderOfCourse[0]?.totalOrders}
              </span>
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
              Tổng doanh thu:{" "}
              <span className="font-[400]">{orderOfCourse[0]?.totalPrice}</span>
            </Typography>
          </Box>
          <Box>
            <TableContainer
              sx={{
                marginTop: "30px",
              }}
              component={Paper}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ padding: 2 }}>
                Danh sách Orders
              </Typography>
              <Table sx={{ minWidth: 650 }} aria-label="orders table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Order</TableCell>
                    <TableCell>Người dùng</TableCell>
                    <TableCell align="right">Thời gian Order</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderOfCourse[0]?.orders?.map((order) => {
                    return (
                      <TableRow key={order?.id}>
                        <TableCell component="th" scope="row">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          {order?.userID && order?.userID == userData?.id
                            ? userData?.username
                            : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {format(
                            new Date(order?.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AdminOrders;
