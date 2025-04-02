import React from 'react'
import useTitle from '../../hooks/useTitle';

function Presentation() {

  useTitle({ tabTitle: "iQmenu: QR-код меню для кафе и ресторанов", headerTitle: "Главная" }, [])

  return (
    <div>Presentation</div>
  )
}

export default Presentation