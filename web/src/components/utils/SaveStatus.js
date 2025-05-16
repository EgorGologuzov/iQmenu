import { Alert } from "@mui/material"

const SaveStatus = ({ isSaved }) => {
  return isSaved
    ? <Alert severity="success">Изменения сохранены</Alert>
    : <Alert severity="warning">Не забудьте сохранить изменения</Alert>
}

export default SaveStatus