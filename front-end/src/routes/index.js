import Home from "../pages/user/Home";
import Courses from "../pages/user/Courses";
import About from "../pages/user/About/";
import Category from "@eproject4/pages/user/Courses/Category";
import ListCourses from "@eproject4/pages/user/Courses/ListCourses";
import CourseDetail from "@eproject4/pages/user/Courses/CourseDetail";
import AdminLayout from "@eproject4/components/layout/AdminLayout";
import Login from "@eproject4/pages/auth/Login";
import Register from "@eproject4/pages/auth/Register";
import Topic from "@eproject4/pages/admin/Topic/Topic.jsx";
import Dashboard from "@eproject4/pages/admin/Dashboard";
import SubTopic from "@eproject4/pages/admin/SubTopic";
import UserDashboard from "@eproject4/pages/user/Dashboard";
import CreateCourse from "@eproject4/pages/admin/CreateCourse";
import AdminCourses from "@eproject4/pages/admin/AdminCourses";
import AdminDetailCourse from "@eproject4/pages/admin/AdminCourses/AdminDetailCourse.jsx";
import AdminLession from "@eproject4/pages/admin/AdminCourses/AdminLession";
import WatchCourse from "@eproject4/pages/user/Courses/WatchCourse";
import CheckoutCart from "@eproject4/pages/user/Order/CheckoutCart";
import { ConfirmPayment } from "@eproject4/pages/user/Order/ConfirmPayment";
import AdminUser from "@eproject4/pages/admin/AdminUser";

// Route khong can login van xem duoc
export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/khoa-hoc", component: Courses },
  { path: "/ve-chung-toi", component: About },
  { path: "/category/:topicName", component: Category },
  { path: "/course-list/:topicName", component: ListCourses },
  { path: "/course-detail/:category/:title/:id", component: CourseDetail },
  { path: "/dang-nhap", component: Login },
  { path: "/dang-ky", component: Register },
];

// Route can login moi xem duoc
export const privateRoutes = [
  { path: "/dashboard-student", component: UserDashboard },
  { path: "/watch-course/:title/:id", component: WatchCourse },
  { path: "/watch-course/:title/:id/:slug", component: WatchCourse },
  { path: "/checkoutCart", component: CheckoutCart },
  { path: "/confirmPayment", component: ConfirmPayment },
];

// Route chi danh cho admin
export const adminRoutes = [
  {
    path: "/admin/danh-muc",
    component: Topic,
    layout: AdminLayout,
    name: "Danh mục",
  },
  {
    path: "/admin/danh-muc-con",
    component: SubTopic,
    layout: AdminLayout,
    name: "Danh mục con",
  },
  {
    path: "/admin/dashboard",
    component: Dashboard,
    layout: AdminLayout,
    name: "Dashboard",
  },
  {
    path: "/admin/user",
    component: AdminUser,
    layout: AdminLayout,
    name: "Users",
  },

  {
    path: "/admin/tao-khoa-hoc",
    component: CreateCourse,
    layout: AdminLayout,
    name: "Tạo khóa học",
  },
  {
    path: "/admin/khoa-hoc",
    component: AdminCourses,
    layout: AdminLayout,
    name: "Quản lý khóa học",
  },
  {
    path: "/admin/khoa-hoc/:slug",
    component: AdminDetailCourse,
    layout: AdminLayout,
    name: "Quản lý khóa học",
  },
  {
    path: "/admin/khoa-hoc/:slug/bai-hoc",
    component: AdminLession,
    layout: AdminLayout,
    name: "Quản lý khóa học",
  },
];
