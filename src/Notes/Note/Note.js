import React from 'react'
import './Note.scss'
import {withRouter} from 'react-router-dom'


const Note = props => {
  return (
    <div className="note__item">
      <div className="note__name">Название: <p>{props.name}</p></div>
      <div className="note__date">Дата создания: <p>{props.date}</p></div>
      <div className="note__text">Описание: <p>{props.text}</p></div>
      <div className="note__datePassed">Прошло времени: <p>{props.datePassed}</p></div>
    </div>
  )
}

export default withRouter(Note)
