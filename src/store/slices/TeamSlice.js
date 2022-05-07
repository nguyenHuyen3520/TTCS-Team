import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    meeting: {
        team_id: null,
        _id: null,
        name: null
    },
    mainStream: null,
    participants: {},
    currentUser: null,
}

export const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        setMeeting: (state, action) => {
            if (action.payload) {                
                let payload = action.payload;
                state = {...state, meeting: payload }
                return state;
            }
        },
        resetMeeting: (state) => {
            let payload = initialState.meeting;
            state = {...state, meeting: payload }
            return state;
        },
        setMainStream: (state, action) => {
            if (action.payload) {
                let payload = action.payload;
                state = {...state, ...payload };
                return state;
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setMeeting, resetMeeting } = teamSlice.actions

export default teamSlice.reducer