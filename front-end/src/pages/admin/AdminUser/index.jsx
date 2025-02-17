import { getAllUsers } from "@eproject4/services/user.service";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminUser() {
  const { getAllUsersAction } = getAllUsers();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Get all users
  const fetchDataAllUsers = async () => {
    const res = await getAllUsersAction();
    setUsers(res?.data);
  };

  useEffect(() => {
    fetchDataAllUsers();
  }, []);

  // Create data table
  const createData = (id, username, email, phoneNumber, role) => {
    return { id, username, email, phoneNumber, role };
  };

  const rows = users.map((user) => {
    user?.roleId === 1 ? (user.roleId = "Admin") : (user.roleId = "User");
    return createData(
      user?.id,
      user?.username,
      user?.email,
      user?.phoneNumber,
      user?.roleId
    );
  });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box
      sx={{
        width: "80%",
        marginX: "auto",
        backgroundColor: "#FFF",
        height: "auto",
        padding: "20px",
      }}>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Tên tài khoản</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Số điện thoại</TableCell>
                <TableCell align="right">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    <TableCell component="th" scope="row">
                      {row?.id}
                    </TableCell>
                    <TableCell align="right">{row?.username}</TableCell>
                    <TableCell align="right">{row?.email}</TableCell>
                    <TableCell align="right">{row?.phoneNumber}</TableCell>
                    <TableCell align="right">{row?.role}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[]}
          />
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AdminUser;
