import React from 'react'

import classes from './error-msg.module.scss'
import img from './error.svg'

const ErrorMsg = () => {
  return (
    <div className={classes['error-msg']}>
      <img src={img} alt="Изображение ошибки" className={classes.img} />
      <p className={classes['error-msg-text']}>Сервис временно недоступен, попробуйте позже</p>
    </div>
  )
}

export default ErrorMsg
