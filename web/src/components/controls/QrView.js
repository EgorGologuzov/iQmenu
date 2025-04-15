import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import withInputShell from '../../hoc/withInputShell';

const ActionButton = ({ icon, onClick, noCopy }) => {

  const sx = { height: "37px", "& span": { margin: "0px" } };

  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    if (!isCopied) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
      onClick && onClick();
    }
  }

  if (noCopy) {
    return (
      <Button
        variant="contained"
        size="small"
        startIcon={icon}
        color="primary"
        onClick={onClick}
        sx={sx}
      />
    )
  }

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={isCopied ? undefined : icon}
      color={isCopied ? "success" : "primary"}
      onClick={handleClick}
      sx={sx}
    >
      {isCopied ? "Скопировано" : ""}
    </Button>
  )
}

const QrView = ({ src }) => {

  const handleSaveButtonClick = async () => {
    const response = await fetch(src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleImageCopyButtonClick = async () => {
    const response = await fetch(src);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
  }

  const handleUrlCopyButtonClick = () => {
    navigator.clipboard.writeText(src);
  }

  return (
    <Stack
      direction="column"
      spacing={2}
      position="relative"
    >
      <Box
        component="img"
        sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 2 }}
        src={src}
        alt={"QR-код для доступа к меню"}
      />

      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-end"
        sx={{ position: 'absolute', bottom: 8, right: 8, }}
      >
        <ActionButton
          icon={<LinkIcon />}
          onClick={handleUrlCopyButtonClick}
        />
        <ActionButton
          icon={<ContentCopyIcon />}
          onClick={handleImageCopyButtonClick}
        />
        <ActionButton
          icon={<SaveIcon />}
          onClick={handleSaveButtonClick}
          noCopy
        />
      </Stack>

    </Stack>
  )
}

export default withInputShell(memo(QrView))