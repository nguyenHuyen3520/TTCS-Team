import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    student: undefined,
    teacher: undefined,
    admin: undefined,
    token: localStorage.getItem('accessToken'),
    profile: localStorage.getItem('profile'),    
}

export const userReducer = createSlice({
    name: 'user',
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
export const { login, logout, customer } = userReducer.actions

export default userReducer.reducer