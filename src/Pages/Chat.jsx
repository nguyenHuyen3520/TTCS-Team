import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/firebase";
import User from "../Components/User";
import MessageForm from "../Components/MessageForm";
import Message from "../Components/Message";
const Chat = () => {
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState("");
    const [text, setText] = useState("");
    const [img, setImg] = useState("");
    const [msgs, setMsgs] = useState([]);
    // const [avatar, setAvatar] = useState(null);
    const profile = JSON.parse(localStorage.getItem('profile'));
    const user1 = profile.uid;

    useEffect(async() => {
        const usersRef = storage.collection( "users");
        const q = usersRef.where("uid", "not-in", [user1]);
        // const q = usersRef(usersRef, where("uid", "not-in", [user1]));
        const unsub = await q.onSnapshot((querySnapshot) => {
            console.log('querySnapshot', querySnapshot)
            let users = [];
            querySnapshot.forEach((doc) => {
                console.log('doc:', doc)
                users.push(doc.data());
            });
            setUsers(users);
        });
        return () => unsub();
    }, [user1]);

    const selectUser = async (user) => {
        setChat(user);

        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        const msgsRef = await storage.collection("messages").doc(id).doc("chat");
        const q = await msgsRef.orderBy("createdAt", "asc");

        q.onSnapshot((querySnapshot) => {
            let msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push(doc.data());
            });
            setMsgs(msgs);
        });

        // get last message b/w logged in user and selected user
        const docSnap = await storage.doc("lastMsg").doc(id);
        // if last message exists and message is from selected user
        if (docSnap.data() && docSnap.data().from !== user1) {
            // update last message doc, set unread to false
            await docSnap.update({ unread: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user2 = chat.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        let url;
        // if (img) {
        //     const imgRef = ref(
        //         storage,
        //         `images/${new Date().getTime()} - ${img.name}`
        //     );
        //     const snap = await uploadBytes(imgRef, img);
        //     const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        //     url = dlUrl;
        // }

        await storage.collection("messages").doc(id).doc("chat").update({
            text,
            from: user1,
            to: user2,
            createdAt: db.firestore.Timestamp.fromDate(new Date()),
            media: url || "",
        });

        await storage.collection("lastMsg").doc("lastMsg").doc(id).set({
            text,
            from: user1,
            to: user2,
            createdAt: db.firestore.Timestamp.fromDate(new Date()),
            media: url || "",
            unread: true,
        });

        setText("");
        setImg("");
    };
    return (
        <div className="home_container">
            <div className="users_container">
                <div className="font-bold text-xl">Chat</div>
                {users.map((user) => (
                    <User
                        key={user.uid}
                        user={user}
                        selectUser={selectUser}
                        user1={user1}
                        chat={chat}
                    />
                ))}
            </div>
            <div className="messages_container bg-slate-200">
                {chat ? (
                    <>
                        <div className="messages_user">
                            <h3 className="font-bold text-xl">{chat.name}</h3>
                        </div>
                        <div className="messages">
                            {msgs.length
                                ? msgs.map((msg, i) => (
                                    <Message key={i} msg={msg} user1={user1} />
                                ))
                                : null}
                        </div>
                        <MessageForm
                            handleSubmit={handleSubmit}
                            text={text}
                            setText={setText}
                            setImg={setImg}
                        />
                    </>
                ) : (
                    <h3 className="no_conv">Select a user to start conversation</h3>
                )}
            </div>
        </div>
    );
};

export default Chat;


