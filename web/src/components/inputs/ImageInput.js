import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Stack, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { fileToDataUrl } from '../../utils/utils';
import withInputShell from '../../hoc/withInputShell';

function ImageInput({ image, onChange }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      onChange && onChange(file);
      setError(null);
    } catch (er) {
      setError(er);
    }
  }, [onChange])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    onDrop,
  });

  const rootProps = getRootProps();
  const { ref: dropzoneRef, ...inputProps } = getInputProps();
  const inputRef = useRef(null);
  const combinedRef = (node) => {
    dropzoneRef.current = node;
    inputRef.current = node;
  }

  const handleDeleteButtonClick = useCallback(() => {
    onChange && onChange(null);
    setError(null);
    setImageUrl(null);
    inputRef.current.value = "";
  }, [onChange])

  const syncImageWithImageUrl = async () => {
    if (typeof image == "string") {
      setImageUrl(image);
    } else if (image instanceof File) {
      setImageUrl(await fileToDataUrl(image));
    }
  }

  useEffect(() => {
    syncImageWithImageUrl();
  }, [image]);

  return (
    <Stack direction="column" spacing={2} sx={{ width: '100%' }}>

      {imageUrl && (
        <Stack direction="column" position="relative">
          <Box
            component="img"
            sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 2 }}
            src={imageUrl}
            alt={imageUrl}
          />
          <Button
            onClick={handleDeleteButtonClick}
            sx={{ position: 'absolute', top: 8, left: 8, }}
            startIcon={<DeleteIcon />}
            color="error"
            variant="contained"
            >
            Удалить
          </Button>
        </Stack>
      )}

      <Stack {...rootProps}
        direction="column"
        alignItems="center"
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main' },
        }}
      >
        <input {...inputProps} ref={combinedRef} />
        <CloudUploadIcon />
        <Typography variant="subtitle2" component="div">
          Перетащите изображение сюда или <Link color="secondary" >выберите файл</Link>
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary" gutterBottom>
          Поддерживаемые форматы: JPG, PNG (до 5MB)
        </Typography>
      </Stack>

      {error && (
        <Typography color="error">
          {error.message}
        </Typography>
      )}
    </Stack>
  );
}

export default withInputShell(ImageInput);