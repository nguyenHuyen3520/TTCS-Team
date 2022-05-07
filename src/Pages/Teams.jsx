import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai";
import { Link } from 'react-router-dom';
import teamApi from '../api/teamApi';
import { Images } from '../config/images'

const Teams = () => {

  const [check, setCheck] = useState(false)
  const [checkHidden, setCheckHidden] = useState(false)
  const [teams, setTeams] = useState(null)
  const getAllMyTeams = async () => {
    const response = await teamApi.getAllMyTeams();
    setTeams(response.data);
  }
  useLayoutEffect(() => {
    getAllMyTeams();
  }, [])

  return (
    <div className="teams">
      <div style={{ padding: '20px' }}>
        <div className="teams__header">
          <div className="teams__header__left">Teams</div>
          <div className="teams__header__right">
            <div className="teams__header__right__icon">
              <AiOutlineUsergroupAdd size={20} />
            </div>
            <div className="teams__header__right__title">
              <Link to="/JoinTeam">
                Join Or Create team
              </Link>
            </div>
          </div>
        </div>
        <div className="teams__container">
          <div className="teams__container__title" onClick={() => setCheck(!check)}>
            {
              teams?.length > 0 ? (
                <div className="teams__container__title__icon">
                  <AiFillCaretRight />
                </div>
              ) : (
                <div className="teams__container__title__icon">
                  <AiFillCaretDown />
                </div>
              )
            }
            <div>Your teams</div>
          </div>
          {teams?.length > 0 ? (
            <div className="teams__container__list grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-8 grid gap-3">
              {
                teams?.map((item, index) => (
                  <Link key={index} to={`/Teams/${item._id}`} >
                    <div className="teams__container__list__item flex justify-center items-center ">
                      <div>
                        <div className="teams__container__list__item__img flex justify-center items-center w-full">
                          <img src={item.image} className="flex justify-center items-center" style={{ height: 64, width: 64 }} />
                        </div>
                        <div className="teams__container__list__item__text">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          ) : null
          }
          <div className="teams__container__title" onClick={() => setCheckHidden(!checkHidden)}>
            {
              checkHidden ? (
                <div className="teams__container__title__icon">
                  <AiFillCaretRight />
                </div>
              ) : (
                <div className="teams__container__title__icon">
                  <AiFillCaretDown />
                </div>
              )
            }
            <div>Hidden teams</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Teams