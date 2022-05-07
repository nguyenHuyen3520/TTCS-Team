import React, { useState } from 'react'
import { AiOutlineLeft } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import teamApi from '../api/teamApi';
const JoinTeam = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [codeTeam, setCodeTeam] = useState('');
    const [joinTeam, setJoinTeam] = useState(false);
    const handlerJoinTeam = async () => {
        if (codeTeam.length > 0) {
            console.log('vao day', codeTeam)
            const response = await teamApi.joinTeam(codeTeam)
            toast(response.message, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    return (
        <div className="joinTeam">
            <Link to="/Teams">
                <div className="joinTeam__header">
                    <div>
                        <AiOutlineLeft fontSize="16px" />
                    </div>
                    <div>
                        Back
                    </div>
                </div>
            </Link>
            <div className="joinTeam__container">
                <div className="joinTeam__container__title">
                    Join a team
                </div>
                <div className="flex">
                    {
                        profile.typeUser === 'admin' || profile.typeUser === 'teacher' ? (
                            <div className="joinTeam__container__box mr-8 group">
                                <div style={{ display: 'flex', justifyContent: 'center' }} className="mt-5">
                                    <div style={{ height: '60px', width: '60px', backgroundColor: '#cfd3d8', borderRadius: '5px' }}>
                                        <div className="flex justify-center items-center w-full h-full">
                                            <img src="https://statics.teams.cdn.office.net/hashed/teamimage-empty-67acc1e.svg" alt="image" className="w-full h-full rounded-md" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center my-3 font-bold">
                                    Create a team
                                </div>
                                <div className="text-center mt-3 group-hover:hidden" style={{ fontSize: '0.7rem' }}>
                                    Bring everyone together and get to work
                                </div>
                                <div className="w-full mt-5 cursor-pointer hidden group-hover:block">
                                    <div className="w-full justify-center items-center flex">
                                        <div className="w-36 justify-center items-center flex bg-blue-600 text-white h-7 rounded-md">
                                            Create team
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    }
                    <div className="joinTeam__container__box">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ height: '60px', width: '60px', backgroundColor: '#cfd3d8', borderRadius: '5px' }}>
                                <div className="flex justify-center items-center w-full h-full">
                                    <RiTeamFill fontSize="25px" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center my-3 font-bold">
                            Join a team with a code
                        </div>
                        <div className="w-full">
                            <input type="text" className="w-full" value={codeTeam} onChange={(e) => setCodeTeam(e.target.value)} placeholder="Enter code" />
                        </div>
                        <div className="w-full mt-5 cursor-pointer">
                            <div className="w-full justify-center items-center flex">
                                <div className="w-36 justify-center items-center flex bg-blue-600 text-white h-7 rounded-md" onClick={() => handlerJoinTeam()}>
                                    Join Team
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default JoinTeam