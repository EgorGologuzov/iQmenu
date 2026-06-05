import React from 'react'

function Logo({ width = "30px", height = "30px", bg = "no" }) {
  return <img
    src={({ no: "/logo.svg", circle: "/logo-circle.svg", rect: "/logo-rect.svg" })[bg]}
    width={width}
    height={height}
  />
}

export default Logo