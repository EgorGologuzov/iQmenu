import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setFilters } from '../store/slices/pageSlice';

function useFiltersInitialValue(value) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilters(value));
    return () => dispatch(setFilters({}));
  }, [])
}

export default useFiltersInitialValue