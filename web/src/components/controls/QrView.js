import { Box, Button, Stack } from '@mui/material'
import React, { memo, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import withInputShell from '../../hoc/withInputShell';
import { API_BASE_URL } from '../../values/urls';

const ActionButton = ({ icon, onClick, noCopy }) => {

  const [isCopied, setIsCopied] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const handleClick = async () => {
    if (!isCopied && !isError) {
      setIsBusy(true);
      try {
        onClick && await onClick();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      } catch (er) {
        console.error("Не удалось выполнить действие", er);
        setIsError(true);
        setTimeout(() => setIsError(false), 5000);
      } finally {
        setIsBusy(false);
      }
    }
  }

  const isSuccess = isCopied && !noCopy;

  return (
    <Button
      variant="contained"
      size="small"
      loadingPosition="center"
      sx={{ height: "37px", "& span": { margin: "0px" } }}
      startIcon={isSuccess || isError ? undefined : icon}
      color={isSuccess ? "success" : isError ? "error" : "primary"}
      onClick={handleClick}
      loading={isBusy}
    >
      {isSuccess ? "Скопировано!" : isError ? "Ошибка!" : ""}
    </Button>
  )
}

const QrView = ({ src }) => {

  src = (new URL(src, API_BASE_URL)).toString();

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

  const handleUrlCopyButtonClick = async () => {
    await navigator.clipboard.writeText(src);
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