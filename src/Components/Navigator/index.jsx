import React from 'react'
import { Link, useLocation } from 'react-router-dom'
// import { GrNotification } from "react-icons/gr";
import { AiFillHome } from "react-icons/ai";
import { BsCalendar3, BsFillChatTextFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { connect } from 'react-redux';
const data = [
    {
        title: "Home",
        icon: <AiFillHome size="20" />,
        path: "Home"
    },
    {
        title: "Chat",
        icon: <BsFillChatTextFill size="20" />,
        path: "Chat"
    },
    {
        title: "Teams",
        icon: <RiTeamFill size="20" />,
        path: "Teams"
    },
    {
        title: "Calendar",
        icon: <BsCalendar3 size="20" />,
        path: "Calendar"
    },
]


const Navigator = (props) => {
    const meeting = props.meeting;
    const { pathname } = useLocation()
    const activeNav = data.findIndex(e => pathname.split('/').includes(e.title))
    return (
        <div className={`Navigator  ${meeting?._id ? 'bg-dark_mode' : 'bg-bg-light'}`}>
            {
                data.map((item, index) => (
                    <Link key={index} to={`/${item.path}`}>
                        <div className={`${index === activeNav ? 'Navigator__active' : ''} Navigator__item hover:text-default`}>
                            <div className={`${meeting?._id ? 'text-bg-hover' : 'text-black'} ${index === activeNav ? 'text-default' : ''}`}>
                                {item.icon}
                            </div>
                            <div className={`${meeting?._id ? 'text-bg-hover' : 'text-black'} ${index === activeNav ? 'text-default' : ''}`}>
                                {item.title}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        meeting: state.meeting,
    };
};

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setMainStream: (stream) => dispatch(setMainStream(stream)),
//         updateUser: (user) => dispatch(updateUser(user)),
//     };
// };

export default connect(mapStateToProps, null)(Navigator);
