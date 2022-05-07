import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import teamApi from '../api/teamApi';
import { AiOutlineLeft, AiOutlineFileAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoPersonAddOutline } from "react-icons/io5";
import DetailChannel from '../Components/DetailChannel';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import firepadRef, { db } from "../firebase/firebase";
import MainScreen from '../Components/MainScreen/MainScreen.component'
import {
  setMainStream,
  addParticipant,
  setUser,
  removeParticipant,
  updateParticipant,
} from "../store/actioncreator";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DetailTeam = (props) => {
  const profile = JSON.parse(localStorage.getItem('profile'));
  const meeting = props.meeting;
  const urlparams = new URLSearchParams(window.location.search);
  const roomId = urlparams.get("roomId");
  let [searchParams] = useSearchParams();
  const [formChannel, setFormChannel] = useState({ channelName: '', description: '', team_id: '' })
  const navigate = useNavigate();
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [team, setTeam] = useState(null)
  const [showManageTeam, setShowManageTeam] = useState(false)
  const [showAddChannel, setShowAddChannel] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [typeMember, setTypeMember] = useState('students')
  const getDetailTeam = async () => {
    const response = await teamApi.getDetailTeam(id);
    setTeam(response.data);
  }
  const handleClose = () => setShowManageTeam(false);
  const handleCloseMeeting = () => {
    // dispatch(resetMeeting())
  }

  const handleChangeTextFormChannel = (e) => {
    setFormChannel((prevState) => {
      const newState = { ...prevState, [e.target.name]: e.target.value, team_id: team._id };
      return newState;
    })
  }
  const handlePostChannel = async () => {
    const response = await teamApi.postChannel(formChannel);
    if (response.success) {
      setTeam(response.data);
      setShowAddChannel(false)
    }
  }
  const handleDeleteChannel = async ({ channel_id, team_id }) => {
    const response = await teamApi.deleteChannel({ channel_id, team_id })
    if (response.success) {
      setTeam(response.data);
    }
  }

  useLayoutEffect(() => {
    getDetailTeam()
  }, [])

  useEffect(() => {
    if (searchParams.get('test')) {
      // console.log('searchParams trong detailTeam', searchParams.get('test'))
    }
  }, [searchParams])

  useEffect(() => {
    setChannel(team?.channels[0])
  }, [team])

  useEffect(() => {
    if (meeting) {
      // console.log('meeting trong DetailTeam', meeting);
    }
  }, [meeting])

  const getUserStream = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    return localStream;
  };
  const getStream = async () => {
    if (roomId) {
      const profile = JSON.parse(localStorage.getItem('profile'));
      const userName = profile?.userName
      const participantRef = firepadRef.child(roomId).child("participants");
      const stream = await getUserStream();
      stream.getVideoTracks()[0].enabled = false;
      props.setMainStream(stream);

      connectedRef.on("value", (snap) => {
        if (snap.val()) {
          const defaultPreference = {
            audio: true,
            video: false,
            screen: false,
          };
          const userStatusRef = participantRef.push({
            userName,
            preferences: defaultPreference,
          });
          props.setUser({
            [userStatusRef.key]: { name: profile.userName, ...defaultPreference },
          });
          userStatusRef.onDisconnect().remove();
        }
      });
    }
  }
  useEffect(() => {
    getStream();
  }, [roomId]);

  const connectedRef = db.database().ref(".info/connected");

  const isUserSet = !!props.user;
  const isStreamSet = !!props.stream;

  useEffect(() => {
    if (isStreamSet && isUserSet) {
      if (roomId) {
        const participantRef = firepadRef.child(roomId).child("participants");
        participantRef.on("child_added", (snap) => {
          const preferenceUpdateEvent = participantRef
            .child(snap.key)
            .child("preferences");
          preferenceUpdateEvent.on("child_changed", (preferenceSnap) => {
            props.updateParticipant({
              [snap.key]: {
                [preferenceSnap.key]: preferenceSnap.val(),
              },
            });
          });
          const { userName: name, preferences = {} } = snap.val();
          props.addParticipant({
            [snap.key]: {
              name,
              ...preferences,
            },
          });
        });
        participantRef.on("child_removed", (snap) => {
          props.removeParticipant(snap.key);
        });
      }
    }
  }, [isStreamSet, isUserSet, roomId]);

  return (
    roomId ?
      (
        <div className="relative" style={{ backgroundColor: '#1b1a1a', padding: 10, height: '100vh' }}>
          {/* <div className="absolute top-7 right-10 text-white px-3 py-1 rounded-sm hover:bg-slate-700 cursor-pointer" style={{border: '1px solid white'}} onClick={() =>handleCloseMeeting()}>
            Close
          </div> */}
          <div>
            <MainScreen />
          </div>
        </div>
      ) :
      (
        <div>
          <Modal
            open={showAddChannel}
            onClose={() => setShowAddChannel(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="modal-custom">
                <div className="bold title">
                  Create a channel for "{team?.name}" team
                </div>
                <div>
                  <div>
                    Chanel name
                  </div>
                  <div>
                    <input placeholder="Letters, numbers, and spaces are allowed" className="modal-custom__input" value={formChannel.channelName} name="channelName" onChange={(e) => handleChangeTextFormChannel(e)} />
                  </div>
                </div>
                <div>
                  <div>
                    Description (optional)
                  </div>
                  <div>
                    <textarea placeholder="Help others find the right channel by providing a description" className='modal-custom__textarea' value={formChannel.description} name="description" onChange={(e) => handleChangeTextFormChannel(e)} />
                  </div>
                </div>
                <div className="flex flex-row justify-end mt-4 cursor-pointer">
                  <div className="p-2 border mr-2 px-4 rounded-md hover:bg-bg-hover" onClick={() => setShowAddChannel(false)}>
                    Cancel
                  </div>
                  <div className="p-2 border px-4 rounded-md hover:bg-bg-hover" onClick={() => handlePostChannel()}>
                    Add
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
          <Modal
            open={showAddMember}
            onClose={() => setShowAddMember(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="modal-custom">
                <div className="bold title">
                  Add member to "{team?.name}" team
                </div>
                <div className="mt-3 cursor-pointer">
                  <div className="mb-3 flex">
                    <div className={`mr-3 hover:text-default  ${typeMember === 'students' ? 'border-active border-b-4' : ''}`} onClick={() => setTypeMember('students')}>
                      Students
                    </div>
                    <div className={`mr-3 hover:text-default ${typeMember === 'teachers' ? 'border-active border-b-4' : ''}`} onClick={() => setTypeMember('teachers')}>
                      Teachers
                    </div>
                  </div>
                  <div>
                    {
                      typeMember === 'students' ? (
                        <input placeholder="Search for students" className="modal-custom__input" />
                      ) : (
                        <input placeholder="Search for teachers" className="modal-custom__input" />
                      )
                    }
                  </div>
                </div>
                <div className="flex flex-row justify-end mt-4 cursor-pointer">
                  <div className="p-2 border mr-2 px-4 rounded-md hover:bg-bg-hover" onClick={() => setShowAddMember(false)}>
                    Close
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
          <div className="team__detail flex">
            <div className="team__detail__left">
              <div className="team__detail__left__above px-3">
                <div className="flex cursor-pointer hover:text-default py-5" onClick={() => navigate(-1)} >
                  <div className="mr-2">
                    <AiOutlineLeft />
                  </div>
                  <div>
                    All teams
                  </div>
                </div>
                <div>
                  <img src={team?.image} style={{ height: '65px', width: '65px' }} alt="" />
                </div>
                <div className="flex justify-between items-center py-5 ">
                  <div className="team__detail__left__title title1">
                    {team?.name}
                  </div>
                  <div className="cursor-pointer team__detail__left__threedot relative" tabIndex="0">
                    <div className="hover:text-default">
                      <BsThreeDots />
                    </div>
                    <div className="team__detail__left__settings">
                      <div className="title my-2 flex hover:bg-slate-400" onClick={() => setShowManageTeam(true)}>
                        <div >
                          <FiSettings />
                        </div>
                        <div>
                          Manage Team
                        </div>
                      </div>
                      {
                        profile.typeUser === 'admin' || profile.typeUser === 'teacher' ? (
                          <div className="title my-2 flex hover:bg-slate-400" onClick={() => setShowAddMember(true)}>
                            <div>
                              <IoPersonAddOutline />
                            </div>
                            <div>
                              Add Member
                            </div>
                          </div>
                        ) : null
                      }

                      {
                        profile.typeUser === 'admin' || profile.typeUser === 'teacher' ? (
                          <div className="title my-2 flex hover:bg-slate-400" onClick={() => setShowAddChannel(true)}>
                            <div>
                              <AiOutlineFileAdd />
                            </div>
                            <div>
                              Add Channel
                            </div>
                          </div>
                        ) : null
                      }
                      {
                        profile.typeUser === 'admin' || profile.typeUser === 'teacher' ? (
                          <div className="title my-2 flex hover:bg-slate-400">
                            <div>
                              <RiDeleteBin6Line />
                            </div>
                            <div>
                              Delete Team
                            </div>
                          </div>
                        ) : null
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="team__detail__left__under">
                <div className="title px-3 py-2">
                  Channels
                </div>
                <div>
                  {
                    team?.channels.sort((a, b) => a.channelName > b.channelName).map((item) => (
                      <div key={item._id} onClick={() => setChannel(item)} className={`flex justify-between items-center ${item?.channelName + '' + item?._id === channel?.channelName + '' + channel?._id ? 'channel__active' : null} hover:cursor-pointer `} >
                        <div className={`py-2 pl-3`}>
                          {item?.channelName}
                        </div>
                        <div className="pr-3  channel__item " tabIndex="0" >
                          <div className="hover:text-default flex items-center justify-center">
                            <BsThreeDots />
                          </div>
                          <div className="channel__item__options">
                            <div className="w-full">
                              Edit This Channel
                            </div>
                            <div onClick={() => handleDeleteChannel({ channel_id: item._id, team_id: team._id })}>
                              Delete This Channel
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="team__detail__right w-full" style={{ height: '100vh', backgroundColor: 'white' }}>
              {
                channel ? (
                  <DetailChannel channel={channel} team={team} />
                ) : null
              }
            </div>
          </div>
        </div>
      )
  )
}
const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    user: state.currentUser,
    meeting: state.meeting,
    room: state.room
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMainStream: (stream) => dispatch(setMainStream(stream)),
    addParticipant: (user) => dispatch(addParticipant(user)),
    setUser: (user) => dispatch(setUser(user)),
    removeParticipant: (userId) => dispatch(removeParticipant(userId)),
    updateParticipant: (user) => dispatch(updateParticipant(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailTeam);
