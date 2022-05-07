import {
    SET_MAIN_STREAM,
    ADD_PARTICIPANT,
    SET_USER,
    REMOVE_PARTICIPANT,
    UPDATE_USER,
    UPDATE_PARTICIPANT,
    LOGIN,
    SET_ROOM,
    LOGOUT
} from "./actiontypes";

import {
    createOffer,
    initializeListensers,
    updatePreference,
} from "./peerConnection";

const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("roomId");

let defaultUserState = {
    mainStream: null,
    participants: {},
    currentUser: null,
    student: undefined,
    teacher: undefined,
    admin: undefined,
    token: localStorage.getItem('accessToken'),
    profile: JSON.parse(localStorage.getItem('profile')),
    room: {},
};

const servers = {
    iceServers: [{
        urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
            "stun:stun.services.mozilla.com",
        ],
    },],
    iceCandidatePoolSize: 10,
};

const generateColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

export const userReducer = (state = defaultUserState, action) => {
    if (action.type === SET_MAIN_STREAM) {        
        let payload = action.payload;
        state = { ...state, ...payload };
        return state;
    } else if (action.type === ADD_PARTICIPANT) {        
        let payload = action.payload;
        const currentUserId = Object.keys(state.currentUser)[0];
        const newUserId = Object.keys(payload.newUser)[0];
        if (state.mainStream && currentUserId !== newUserId) {
            payload.newUser = addConnection(
                payload.newUser,
                state.currentUser,
                state.mainStream,
                state
            );
        }

        if (currentUserId === newUserId)
            payload.newUser[newUserId].currentUser = true;
        payload.newUser[newUserId].avatarColor = generateColor();
        let participants = { ...state.participants, ...payload.newUser };
        state = { ...state, participants };
        return state;
    } else if (action.type === SET_USER) {
        if (roomId) {
            let payload = action.payload;
            let participants = { ...state.participants };
            const userId = Object.keys(payload.currentUser)[0];
            payload.currentUser[userId].avatarColor = generateColor();
            initializeListensers(userId, roomId, state);
            state = { ...state, currentUser: { ...payload.currentUser }, participants };
            return state;
        }
    } else if (action.type === REMOVE_PARTICIPANT) {        
        let payload = action.payload;
        let participants = { ...state.participants };
        delete participants[payload.id];
        state = { ...state, participants };
        return state;
    } else if (action.type === UPDATE_USER) {
        if (roomId) {
            let payload = action.payload;
            const userId = Object.keys(payload.currentUser)[0];
            updatePreference(userId, payload.currentUser, roomId);
            state.currentUser[userId] = {
                ...state.currentUser[userId],
                ...payload.currentUser,
            };
            state = {
                ...state,
                currentUser: { ...state.currentUser },
            };
            return state;
        }
    } else if (action.type === UPDATE_PARTICIPANT) {    
        let payload = action.payload;
        const newUserId = Object.keys(payload.newUser)[0];

        payload.newUser[newUserId] = {
            ...state.participants[newUserId],
            ...payload.newUser[newUserId],
        };
        let participants = { ...state.participants, ...payload.newUser };
        state = { ...state, participants };
        return state;
    } else if (action.type === LOGIN) {
        let payload = action.payload;
        state = { ...state, ...payload };
        return state;
    } else if (action.type === SET_ROOM) {        
        let payload = action.payload.setRoom;
        state = { ...state, room: { ...payload } };
        return state;
    } else if (action.type === LOGOUT){
        console.log('vao logout');
        state = { ...state, token: null };
        return state;
    }
    return state;
};

const addConnection = (newUser, currentUser, stream, state) => {
    if (roomId) {
        const peerConnection = new RTCPeerConnection(servers);
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
        });
        const newUserId = Object.keys(newUser)[0];
        const currentUserId = Object.keys(currentUser)[0];

        const offerIds = [newUserId, currentUserId].sort((a, b) =>
            a.localeCompare(b)
        );

        newUser[newUserId].peerConnection = peerConnection;
        if (offerIds[0] !== currentUserId)
            createOffer(peerConnection, offerIds[0], offerIds[1], roomId);
        return newUser;
    }
};