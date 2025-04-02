import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setTitle } from '../store/slices/pageSlice';
import { DEFAULT_HEADER_TITLE, DEFAULT_TAB_TITLE } from '../values/strings';

function useTitle(payload, deps) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTitle(payload));
    return () => { dispatch(setTitle({ tabTitle: DEFAULT_TAB_TITLE, headerTitle: DEFAULT_HEADER_TITLE})) }
  }, deps)
}

export default useTitle