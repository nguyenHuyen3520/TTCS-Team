import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    courses: [],
    myCourse: [],
    myCalendar: []
}

export const CourseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        login: (state, action) => {            
            if (action.payload) {                
                state.token = action.payload;
            }
        },
        logout: (state) => {
            state = initialState;
            return state;
        },
        student: (state, action) => {
            if (!state.token) {
                state.student = undefined;
            } else {
                state.student = action.payload;
            }
        },
        teacher: (state, action) => {
            if (!state.token) {
                state.teacher = undefined;
            } else {
                state.teacher = action.payload;
            }
        },
        admin: (state, action) => {
            if (!state.token) {
                state.admin = undefined;
            } else {
                state.admin = action.payload;
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { login, logout, customer } = CourseSlice.actions

export default CourseSlice.reducer