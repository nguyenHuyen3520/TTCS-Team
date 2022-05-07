import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RouterMain from './routes'
import Header from './Components/Header'
import Navigator from './Components/Navigator'
import { connect } from 'react-redux'
import Login from './Pages/Login'
import 'react-toastify/dist/ReactToastify.css';
const App = ({ token, profile }) => {  
  return (
    token ?
      (<BrowserRouter>
        <div className="body" style={{ height: '100%' }}>
          <Header />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div>
              <Navigator />
            </div>
            <div style={{ width: '100%'}}>
              <RouterMain />
            </div>
          </div>
        </div>
      </BrowserRouter>) : <Login/>
  )
}
const mapStateToProps = (state) => {
  return {
    token: state.token,
    profile: state.profile,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     setMainStream: (stream) => dispatch(setMainStream(stream)),
//     addParticipant: (user) => dispatch(addParticipant(user)),
//     setUser: (user) => dispatch(setUser(user)),
//     removeParticipant: (userId) => dispatch(removeParticipant(userId)),
//     updateParticipant: (user) => dispatch(updateParticipant(user)),
//   };
// };

export default connect(mapStateToProps, null)(App);