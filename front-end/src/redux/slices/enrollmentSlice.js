// enrollmentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrolledCourses: {},
};

// Tạo slice cho enrollment
export const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    // Hàm reducer để thiết lập trạng thái đăng ký của khóa học
    setEnrollmentStatus: (state, action) => {
      const { courseId, isEnrolled } = action.payload;
      state.enrolledCourses[courseId] = { isEnrolled };
    },
    // Hàm reducer để thêm khóa học vào danh sách đã đăng ký
    addEnrollment: (state, action) => {
      const { courseId } = action.payload;
      if (!state.enrolledCourses[courseId]) {
        state.enrolledCourses[courseId] = { isEnrolled: true };
      }
    },
    // Hàm reducer để thiết lập danh sách đăng ký ban đầu từ cơ sở dữ liệu
    setInitialEnrollments: (state, action) => {
      action.payload.forEach((course) => {
        course.orders.forEach((order) => {
          state.enrolledCourses[order.souresID] = {
            isEnrolled: order.status,
          };
        });
      });
    },
  },
});

export const { setEnrollmentStatus, addEnrollment, setInitialEnrollments } =
  enrollmentSlice.actions;
