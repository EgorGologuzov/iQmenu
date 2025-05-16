import { useCallback, useEffect } from 'react';
import { useBlocker, useNavigate } from 'react-router';

const UNSAVE_ALERT_MESSAGE = 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти?';
const BLOCKER_OPTIONS_KEY = 'useUnsavedChangesWarning/blockerOptions';

const useUnsavedChangesWarning = (isSaved = true) => {

  useBlocker((args) => {

    const { ignoreBlock, onNavigate, onCancel } = window[BLOCKER_OPTIONS_KEY] ?? {};

    const navigate = () => {
      window[BLOCKER_OPTIONS_KEY] = undefined;
      onNavigate && onNavigate();
      return false;
    }

    const cancel = () => {
      window[BLOCKER_OPTIONS_KEY] = undefined;
      onCancel && onCancel();
      return true;
    }

    if (isSaved) {
      return navigate();
    }

    if (ignoreBlock) {
      return navigate();
    }

    if (window.confirm(UNSAVE_ALERT_MESSAGE)) {
      return navigate();
    }

    return cancel();
  })

  useEffect(() => {
    if (isSaved) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = UNSAVE_ALERT_MESSAGE;
      return UNSAVE_ALERT_MESSAGE;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSaved]);

  const navigate = useNavigate();

  const navigateWithBlocker = useCallback((to, { ignoreBlock, onNavigate, onCancel, ...otherOptions }) => {
    window[BLOCKER_OPTIONS_KEY] = { ignoreBlock, onNavigate, onCancel };
    navigate(to, otherOptions);
  }, [])

  return navigateWithBlocker;
}

export default useUnsavedChangesWarning;
