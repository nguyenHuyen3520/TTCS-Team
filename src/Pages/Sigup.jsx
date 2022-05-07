import React, { useState } from 'react'
import userApi from './../api/userApi';
import { useNavigate } from 'react-router-dom'
const Signup = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', userName: '', phone: '' })
  const handleSubmit = async () => {    
    const response = await userApi.signup(formData);
    if (response.success) {
      navigation('/login')
    }
  }
  return (
    <div className="login">
      <div className="login__container">
        <div>
          userName:
        </div>
        <div>
          <input type="text" value={formData.username} name="userName" onChange={(e) => setFormData((prevState) => {
            return { ...prevState, userName: e.target.value }
          })} />
        </div>
        <div>
          phone:
        </div>
        <div>
          <input type="text" value={formData.phone} name="phone" onChange={(e) => setFormData((prevState) => {
            return { ...prevState, phone: e.target.value }
          })} />
        </div>
        <div>
          Email:
        </div>
        <div>
          <input type="email" value={formData.email} name="email" onChange={(e) => setFormData((prevState) => {
            return { ...prevState, email: e.target.value }
          })} />
        </div>
        <div>
          Password:
        </div>
        <div>
          <input type="password" onChange={(e) => setFormData((prevState) => {
            return { ...prevState, password: e.target.value }
          })} />
        </div>
        <button type="submit" onClick={() => handleSubmit()} >
          Submit
        </button>
      </div>
    </div>
  )
}

export default Signup