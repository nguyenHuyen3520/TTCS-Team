import React, { useEffect, useState } from "react";
import Img from "../image1.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { storage } from "../firebase/firebase";

const User = ({ user1, user, selectUser, chat }) => {
    const user2 = user?.uid;
    const [data, setData] = useState("");

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        let unsub = storage.collection("lastMsg").onSnapshot((doc) => {
            setData(doc.data());
        });
        return () => unsub();
    }, []);

    return (
        <>
            <div
                className={`user_wrapper ${chat.name === user.name && "selected_user"} rounded-xl`}
                onClick={() => selectUser(user)}
            >
                <div className="user_info">
                    <div className="user_detail flex">
                        <img src={user.avatar || Img} alt="avatar" className="avatar mr-2" />
                        <h4 className="text-black font-bold text-xl">{user.name}</h4>
                        {data?.from !== user1 && data?.unread && (
                            <small className="unread">New</small>
                        )}
                    </div>
                    <div
                        className={`user_status ${user.isOnline ? "online" : "offline"}`}
                    ></div>
                </div>
                {data && (
                    <p className="truncate mt-3">
                        <strong>{data.from === user1 ? "Me:" : null}</strong>
                        {data.text}
                    </p>
                )}
            </div>
            <div
                onClick={() => selectUser(user)}
                className={`sm_container ${chat.name === user.name && "selected_user"}`}
            >
                <img
                    src={user.avatar || Img}
                    alt="avatar"
                    className="avatar sm_screen"
                />
            </div>
        </>
    );
};

export default User;