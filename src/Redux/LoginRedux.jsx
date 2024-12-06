import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    role:null
};


const loginSlice = createSlice({
    name:"login",
    initialState,
    reducers:{
        setUserRole: (state, action) => {
            state.role = action.payload
        }
    }
});


export const {
    setUserRole
} = loginSlice.actions;

export default loginSlice.reducer;