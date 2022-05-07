import React from 'react'
import { connect } from 'react-redux'
import { login } from '../store/slices/UserSlice'

const Test =({token, login})=> {  
  return (
    <div>
      <div>
        <button
          aria-label="Decrement value"
          onClick={() => login('alo')}
        >
          Test
        </button>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  login,
};
const mapStateToProps = (state) => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Test)