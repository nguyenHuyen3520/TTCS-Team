import React, { useState } from 'react'
import userApi from '../api/userApi'
import { connect } from 'react-redux'
import { login } from '../store/actioncreator'
import { storage } from './../firebase/firebase';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const handleSubmit = async () => {
    const response = await userApi.login(formData)
    if (response.success) {      
      
      await storage.collection('users').doc(response.data.uid).update({
        isOnline: true
      })
      login(response.accessToken)
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('profile', JSON.stringify(response.data))
    }
  }
  
  return (
    <div className="login" style={{ backgroundColor: '#f3f2f0' }}>
      <div className="login__container">
        <div style={{ fontSize: '1.2rem', color: '#444791', marginBottom: '1rem' }}>
          Login to your account
        </div>
        <div>
          <input type="email" value={formData.email} name="email" placeholder="Email" onChange={(e) => setFormData((prevState) => {
            return { ...prevState, email: e.target.value }
          })} />
        </div>
        <div>
          <input type="password" value={formData.password} placeholder="Password" onChange={(e) => setFormData((prevState) => {
            return { ...prevState, password: e.target.value }
          })} />
        </div>
        <button className="login__container__button" type="submit" onClick={() => handleSubmit()} style={{ backgroundColor:'#444791'}} >

          Login
        </button>
      </div>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    stream: state.mainStream,
    participants: state.participants,
    currentUser: state.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (token) => dispatch(login(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);