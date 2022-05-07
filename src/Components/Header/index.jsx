import React, { useEffect, useState } from 'react'
import { BsSearch } from "react-icons/bs";
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import userApi from '../../api/userApi';
import { logout } from '../../store/actioncreator';
import { useNavigate } from "react-router-dom";
const Header = (props) => {
  let navigate = useNavigate();
  const meeting = null;
  const accessToken = localStorage.getItem('accessToken')
  // const [check, setCheck] = useState
  const token = props?.token
  const [profile, setProfile] = useState(null);
  const getProfile = async (token) => {
    const response = await userApi.getProfile(token);
    if (response.success) {
      setProfile(response.data);
    }
  }

  const logout = async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profile')
    props.logout();
  }
  useEffect(() => {
    if (token) {
      getProfile(token);
    } else if (accessToken) {
      getProfile(accessToken);
    }
  }, [token, accessToken])

  return (
    <div className={`header ${meeting?._id ? 'bg-dark_mode' : 'bg-default'}`}>
      <div>
        <div></div>
        <div>
          Microsoft Team
        </div>
      </div>
      <div className="header__center">
        <input placeholder="Search" className={`header__center__input ${meeting?._id ? 'bg-bg-dark_mode text-white' : 'bg-white text-black'}`} style={{ height: '30px', borderRadius: '5px' }} />
        <div className="header__center__icon">
          <BsSearch color={`${meeting?._id ? 'white' : 'black'}`} />
        </div>
      </div>
      {
        profile ? (
          <div className="flex">
            <div style={{ height: '30px', width: '30px', borderRadius: '99999px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} className="header__avatar" tabIndex="0">
              <img src={profile.image} alt={profile.userName} style={{ height: '100%', width: '100%', borderRadius: '99999px', justifyContent: 'center' }} />
              {
                profile ? (
                  <div className="profile">
                    <div className="profile__content">
                      <div className="profile__content__avatar">
                        <img src={profile.image} alt={profile.userName} />
                      </div>
                      <div className="profile__content__info" style={{ paddingRight: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '19px' }}>{profile.userName}</div>
                        <div> {profile.email}</div>
                      </div>
                    </div>
                    <div className="profile__item">
                      <div>
                        My account
                      </div>
                    </div>
                    {
                      profile.typeUser === 'admin' ? (
                        <div className="profile__item">
                          <div onClick={() => navigate('ManagementUser')}>
                            Management user
                          </div>
                        </div>
                      ) : null
                    }
                    <div className="profile__item" onClick={() => logout()}>
                      <div>
                        Sign out
                      </div>
                    </div>
                  </div>
                ) : null
              }
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '5px' }}>
              {profile.userName}
            </div>
          </div>
        ) : (
          <div className="flex">
            <div>
              <Link to="/login" >
                <div>
                  Login
                </div>
              </Link >
            </div >
            <div>
              <Link to="/sigup" >
                <div>
                  Sigup
                </div>
              </Link>
            </div>
          </div >
        )
      }

    </div >
  )
}
const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (stream) => dispatch(logout(stream)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
