import React, { memo, useState } from 'react';
import {
  List,
  ListItem,
  TextField,
  IconButton,
  ListItemText,
  Stack,
  Alert
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
import { CSS } from '@dnd-kit/utilities';
import withInputShell from '../../hoc/withInputShell';
import { validateCategory } from '../../data/models/validation';
import { processCategory } from '../../data/models/processing';

const SortableItemContent = memo(({ category, listeners }) => {
  return (
    <>
      <IconButton {...listeners} sx={{ touchAction: 'none', }}>
        <DragIndicatorIcon />
      </IconButton>
      <ListItemText primary={category} />
    </>
  )
})

const SortableItemSecondaryActions = memo(({ category, actions }) => {
  const handleDeleteButtonClick = () => actions.onDelete(category);
  return (
    <IconButton edge="end" onClick={handleDeleteButtonClick}>
      <DeleteIcon />
    </IconButton>
  )
}, (prev, next) => {
  return prev.category == next.category && prev.actions == next.actions;
})

const SortableItem = ({ id, category, actions }) => {
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
      secondaryAction={
        <SortableItemSecondaryActions
          category={category}
          actions={actions}
        />
      }
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
        category={category}
        listeners={listeners}
      />
    </ListItem>
  );
};

const CategoriesInput = ({ categories, onChange }) => {
  const [newCategory, setNewCategory] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [actions, _] = useState({ onDelete: null });

  const processedNewCategory = processCategory(newCategory);
  const { isValid, errors } = validateCategory(processedNewCategory) ?? { isValid: true, errors: {} };
  const isDublicate = categories && categories.includes(processedNewCategory);

  const setCategories = (categories) => {
    onChange && onChange(categories);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleAddCategory = () => {
    const updatedCategories = [...(categories ?? []), processedNewCategory];
    setCategories(updatedCategories);
    setNewCategory('');
  };

  const handleDeleteCategory = (category) => {
    if (categories) {
      const updatedCategories = categories.filter(c => c !== category);
      setCategories(updatedCategories);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((_, index) => index === active.id);
      const newIndex = categories.findIndex((_, index) => index === over.id);
      const newItems = arrayMove(categories, oldIndex, newIndex);
      setCategories(newItems);
    }
    setActiveId(null);
  };

  actions.onDelete = handleDeleteCategory;

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="row" alignItems="start">
        <TextField
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          label="Новая категория"
          variant="outlined"
          size="small"
          error={isDublicate || !isValid}
          helperText={isDublicate ? "Такая категория уже есть" : errors.category}
          fullWidth
          onKeyDown={(e) => e.key === "Enter" && !isDublicate & isValid ? handleAddCategory() : undefined}
        />
        <IconButton
          onClick={handleAddCategory}
          disabled={!newCategory || isDublicate || !isValid}
          color="success"
        >
          <AddIcon />
        </IconButton>
      </Stack>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={categories && categories.map((_, index) => index)}
          strategy={verticalListSortingStrategy}
        >
          <List sx={{ borderWidth: "1px", borderColor: "#c4c4c4", borderStyle: "solid", borderRadius: 2, p: 0 }}>
            {categories && categories.map((category, index) => (
              <SortableItem
                key={category}
                id={index}
                category={category}
                actions={actions}
              />
            ))}
          </List>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <ListItem sx={{ bgcolor: 'background.paper', boxShadow: 3 }}>
              <ListItemText primary={categories[activeId]} />
            </ListItem>
          ) : null}
        </DragOverlay>
      </DndContext>

      {!categories || categories.length === 0 && (
        <Alert severity="info">
          Нет добавленных категорий
        </Alert>
      )}
    </Stack>
  );
};

export default withInputShell(memo(CategoriesInput));