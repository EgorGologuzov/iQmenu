import React from 'react'
import ErrorBase from './ErrorBase'

function E403() {
  return (
    <ErrorBase
      code={403}
      title="Отказано в доступе"
      message='У вас нет доступа к это странице. Возможно, вы забыли войти или вошли не в тот аккаунт.'
      links={[ 
        { text: "Войти", to: "/auth" },
        { text: "Зарегистрироваться", to: "/reg" },
      ]}
    />
  )
}

export default E403