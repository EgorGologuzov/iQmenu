import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Typography, Stack, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ImageInput({ src, onChange }) {
  const [preview, setPreview] = useState({ src: src, isDataUrl: false, hasSrc: !!src });
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Создаем превью
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const newPreview = { src: dataUrl, isDataUrl: true, hasSrc: !!dataUrl };
        setPreview(newPreview);
        setError(null);
        onChange && onChange(file);
      };
      reader.readAsDataURL(file);
    } catch (er) {
      setError(er);
    }
  }, [onChange])

  const handleDeleteButtonClick = useCallback(() => {
    setPreview({ src: null, isDataUrl: false, hasSrc: false });
    setError(null);
    onChange && onChange(null);
    inputRef.current.value = "";
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

  return (
    <Stack direction="column" spacing={2} sx={{ width: '100%' }}>

      {preview && preview.hasSrc && (
        <Stack direction="column" position="relative">
          <Box
            component="img"
            sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 2 }}
            src={preview.src}
            alt="Установленное изобаржение"
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
        <Typography variant="subtitle1" component="div">
          Перетащите изображение сюда или <Link color="secondary" >выберите файл</Link>
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary" gutterBottom>
          Поддерживаемые форматы: JPG, PNG (до 5MB)
        </Typography>
      </Stack>

      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}
    </Stack>
  );
}

export default ImageInput;