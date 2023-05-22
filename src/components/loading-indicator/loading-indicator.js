import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import classes from './loading-indicator.module.scss'

const LoadingIndicator = () => {
  const loadingLine = <LoadingOutlined style={{ fontSize: 30 }} spin />
  return (
    <div className={classes['loading-indicator']}>
      <Spin indicator={loadingLine} />
      <p className={classes['loading-indicator-text']}>Загрузка данных</p>
    </div>
  )
}

export default LoadingIndicator
