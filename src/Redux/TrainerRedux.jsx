import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    projectId:null,
    projectTitle:null
};


const trainerSlice = createSlice({
    name:"trainer",
    initialState,
    reducers:{
        setProjectId: (state, action) => {
            state.projectId = action.payload
        },
        setProjectTitle: (state, action) => {
            state.projectTitle = action.payload
        }
    }
});


export const {
    setProjectId,
    setProjectTitle
} = trainerSlice.actions;

export default trainerSlice.reducer;