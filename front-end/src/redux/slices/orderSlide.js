import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   status: false,
};

const orderSlide = createSlice({
    name:"order",
    initialState,
    reducers:{
        setShoppingCartRender: (state,action) =>{
            state.status = action.payload.status;
        }
    }
});

export const { setShoppingCartRender} = orderSlide.actions;
export default orderSlide.reducer;