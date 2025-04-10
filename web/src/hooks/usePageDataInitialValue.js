import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setPageData } from '../store/slices/pageSlice';

function usePageDataInitialValue(value) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageData(value));
    return () => dispatch(setPageData({}));
  }, [])
}

export default usePageDataInitialValue