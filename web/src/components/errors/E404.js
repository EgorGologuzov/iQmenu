import React from 'react'
import ErrorBase from './ErrorBase'

function E404() {
  return (
    <ErrorBase
      code={404}
      title="Страница не найдена"
      message='Страница с этим URL-адресом не найдена. Возможно, допущена ошибка в URL-адресе.'
    />
  )
}

export default E404