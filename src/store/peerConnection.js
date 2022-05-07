import firepadRef from "../firebase/firebase";
import { store } from "../index";

export const updatePreference = (userId, preference, roomId) => {    
  const participantRef = firepadRef.child(roomId).child("participants");
  const currentParticipantRef = participantRef
    .child(userId)
    .child("preferences");
  setTimeout(() => {
    currentParticipantRef.update(preference);
  });
};

export const createOffer = async (peerConnection, receiverId, createdID, roomId) => {  
  const participantRef = firepadRef.child(roomId).child("participants");
  const currentParticipantRef = participantRef.child(receiverId);
  peerConnection.onicecandidate = (event) => {
    event.candidate &&
      currentParticipantRef
        .child("offerCandidates")
        .push({ ...event.candidate.toJSON(), userId: createdID });
  };

  const offerDescription = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
    userId: createdID,
  };

  await currentParticipantRef.child("offers").push().set({ offer });
};

export const initializeListensers = async (userId, roomId, state) => {  
  const participantRef = firepadRef.child(roomId).child("participants");
  const currentUserRef = participantRef.child(userId);

  currentUserRef.child("offers").on("child_added", async (snapshot) => {
    const data = snapshot.val();
    if (data?.offer) {
      const pc =
        state.participants[data.offer.userId].peerConnection;
      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      await createAnswer(data.offer.userId, userId);
    }
  });

  currentUserRef.child("offerCandidates").on("child_added", (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = state.participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  currentUserRef.child("answers").on("child_added", (snapshot) => {
    const data = snapshot.val();
    if (data?.answer) {
      const pc =
        state.participants[data.answer.userId].peerConnection;
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  });

  currentUserRef.child("answerCandidates").on("child_added", (snapshot) => {
    const data = snapshot.val();
    if (data.userId) {
      const pc = state.participants[data.userId].peerConnection;
      pc.addIceCandidate(new RTCIceCandidate(data));
    }
  });
};

const createAnswer = async (otherUserId, userId, roomId, state) => {  
  const participantRef = firepadRef.child(roomId).child("participants");  
  const pc = state.participants[otherUserId].peerConnection;
  const participantRef1 = participantRef.child(otherUserId);
  pc.onicecandidate = (event) => {
    event.candidate &&
      participantRef1
        .child("answerCandidates")
        .push({ ...event.candidate.toJSON(), userId: userId });
  };

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
    userId: userId,
  };

  await participantRef1.child("answers").push().set({ answer });
};
