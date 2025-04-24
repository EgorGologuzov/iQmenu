import { Link } from '@mui/material'
import { useNavigate } from 'react-router'

const CLink = ({ children, to, options, color="secondary", noStyles=false }) => {
  const navigate = useNavigate();

  if (noStyles) {
    return (
      <div onClick={() => navigate(to, options)} >
        {children}
      </div>
    )
  }

  return (
    <Link color={color} onClick={() => navigate(to, options)} >
      {children}
    </Link>
  )
}

export default CLink