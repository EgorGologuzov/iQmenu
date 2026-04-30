import { IconButton } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { add, remove } from '../../store/slices/favoriteSlice'

function ProductFavoriteButton({ product }) {

  const dispatch = useDispatch();
  const { menuId } = useParams();

  const inFavorites = useSelector(state => {
    const record = state.favorite.find(record => record.menuId == menuId);
    return record && record.products.indexOf(product.id) != -1;
  });

  const handleClick = () => {
    if (inFavorites) {
      dispatch(remove({ menuId: menuId, productId: product.id }));
    } else {
      dispatch(add({ menuId: menuId, productId: product.id }));
    }
  }

  return (
    <IconButton aria-label="Добавить в избранное" color="error" onClick={handleClick}>
      {inFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  )
}

export default ProductFavoriteButton