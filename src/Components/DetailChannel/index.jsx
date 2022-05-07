import React from 'react'
import { BsThreeDots, BsCameraVideo } from "react-icons/bs";
import { connect } from 'react-redux';
import { setRoom } from '../../store/actioncreator';

const DetailChannel = ({ channel, team, setRoom }) => {    
    const handleMeeting = () => {        
        setRoom({ ...channel, team_id: team._id });               
        window.history.replaceState(null, `Teams/${team._id}`, "?roomId="+channel._id );
        window.location.reload();
    }
    return (
        <div className="p-5 flex  justify-between bg-white">
            <div className="flex items-center justify-between">
                <div className="mr-3">
                    <img src={team?.image} style={{ height: '35px', width: '35px' }} alt='' />
                </div>
                <div className="title1">
                    {channel.channelName}
                </div>
            </div>
            <div className="flex">
                <div className="rounded-md flex mr-3 p-2 cursor-pointer hover:bg-slate-300" style={{ border: '1px solid #bfbfbf' }} onClick={() => handleMeeting()}>
                    <div className="flex items-center mr-1">
                        <BsCameraVideo />
                    </div>
                    <div>
                        Meet
                    </div>
                </div>
                <div className="flex items-center">
                    <BsThreeDots />
                </div>
            </div>
        </div>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        setRoom: (data) => dispatch(setRoom(data)),
    };
};

export default connect(null, mapDispatchToProps)(DetailChannel);
