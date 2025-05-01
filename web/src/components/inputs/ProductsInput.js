import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  Stack,
  Alert,
  Button,
  Chip,
  Typography,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { CSS } from '@dnd-kit/utilities';
import ProductEditDialog from '../dialogs/ProductsEditDialog';
import { deepCopy, fileToDataUrl } from '../../utils/utils';
import { PRODUCT_CREATE_TEMPLATE } from '../../values/default';
import withInputShell from '../../hoc/withInputShell';

const SortableItemContent = memo(({ product, actions, listeners }) => {

  const [imageUrl, setImageUrl] = useState(null);

  const handleItemTextClick = () => actions.onEdit(product);

  const handleIsActiveChipClick = (e) => {
    e.stopPropagation();
    actions.onToggleActive(product);
  };

  const syncImageWithImageUrl = async () => {
    if (!product.image) return;

    if (typeof product.image == "string") {
      setImageUrl(product.image);
    }

    if (product.image instanceof File) {
      try {
        setImageUrl(await fileToDataUrl(product.image));
      } catch (er) {
        console.error("Не удалось установить изображение продукта:", er);
      }
    }
  }

  useEffect(() => {
    syncImageWithImageUrl();
  }, [product.image]);

  return (
    <>
      <IconButton {...listeners} sx={{ touchAction: 'none' }}>
        <DragIndicatorIcon />
      </IconButton>

      <ListItemAvatar>
        <Avatar variant="rounded" src={imageUrl}>
          <FastfoodIcon />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Chip
              label={product.isActive ? "Есть" : "Нет"}
              size="small"
              color={product.isActive ? "success" : "error"}
              onClick={handleIsActiveChipClick}
            />
            <Typography noWrap>{product.name}</Typography>
          </Stack>
        }
        secondary={
          <Typography noWrap variant="caption" color="text.secondary">
            {[product.price + ' ₽', ...(product.categories ?? [])].filter(Boolean).join(', ')}
          </Typography>
        }
        onClick={handleItemTextClick}
        sx={{
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
    </>
  )
}, (prev, next) => {
  return prev.listeners == next.listeners && prev.product == next.product && prev.actions == next.actions;
})

const SortableItemSecondaryActions = memo(({ product, actions }) => {
  const handleDeleteButtonClick = () => actions.onDelete(product);
  return (
    <IconButton edge="end" onClick={handleDeleteButtonClick}>
      <DeleteIcon />
    </IconButton>
  )
}, (prev, next) => {
  return prev.product == next.product && prev.actions == next.actions;
})

const SortableItem = ({ id, product, actions }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  return (
    <ListItem
      ref={setNodeRef}
      {...attributes}
      secondaryAction={<SortableItemSecondaryActions product={product} actions={actions} />}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        borderBottomColor: "divider",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        pl: 0
      }}
    >
      <SortableItemContent
        product={product}
        actions={actions}
        listeners={listeners}
      />
    </ListItem>
  );
};

const SortableItemsList = memo(({ products, onEdit, onChange }) => {
  const [activeId, setActiveId] = useState(null);
  const [actions, _] = useState({ onEdit: null, onDelete: null, onToggleActive: null });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDeleteProduct = (product) => {
    onChange(products.filter(p => p.id !== product.id));
  };

  const handleToggleActive = (product) => {
    onChange(products.map(p =>
      p.id === product.id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = products.findIndex(p => p.id === active.id);
      const newIndex = products.findIndex(p => p.id === over.id);
      onChange(arrayMove(products, oldIndex, newIndex));
    }
    setActiveId(null);
  };

  actions.onEdit = onEdit;
  actions.onDelete = handleDeleteProduct;
  actions.onToggleActive = handleToggleActive;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={products.map(product => product.id)}
        strategy={verticalListSortingStrategy}
      >
        <List sx={{ borderWidth: "1px", borderColor: "#c4c4c4", borderStyle: "solid", borderRadius: 2, p: 0 }}>
          {products.map((product) => (
            <SortableItem
              key={product.id}
              id={product.id}
              product={product}
              actions={actions}
            />
          ))}
        </List>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <ListItem sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
            <ListItemText
              primary={products.find(p => p.id === activeId)?.name}
            />
          </ListItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
})

const ProductsInput = ({ products, categories, onChange }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleAddProduct = () => {
    const newProduct = deepCopy(PRODUCT_CREATE_TEMPLATE);
    newProduct.id = Math.random(); // tmp id
    setCurrentProduct(newProduct);
    setEditDialogOpen(true);
  };

  const handleSaveProduct = (product) => {
    if (currentProduct.name) {
      onChange(products.map(p => p.id === currentProduct.id ? product : p));
    } else {
      onChange([...products, product]);
    }
    setEditDialogOpen(false);
  };

  const initTmpIdsForProducts = () => {
    products.forEach(p => {
      if (!p.id) {
        p.id = Math.random();
      }
    })
  }

  const handleEditProduct = useCallback((product) => {
    setCurrentProduct({ ...product });
    setEditDialogOpen(true);
  }, []);

  initTmpIdsForProducts();

  return (
    <Stack direction="column" spacing={1}>
      <Button
        variant="outlined"
        color="success"
        startIcon={<AddIcon />}
        onClick={handleAddProduct}
      >
        Добавить продукт
      </Button>

      <SortableItemsList
        products={products}
        onChange={onChange}
        onEdit={handleEditProduct}
      />

      {products.length === 0 && (
        <Alert severity="info">
          Нет добавленных продуктов
        </Alert>
      )}

      <ProductEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        product={currentProduct}
        categories={categories}
        onSave={handleSaveProduct}
        products={products}
      />
    </Stack>
  );
};

export default withInputShell(memo(ProductsInput));