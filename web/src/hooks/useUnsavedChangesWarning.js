import { useEffect } from 'react';

const UNSAVE_ALERT_MESSAGE = 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти?';

const useUnsavedChangesWarning = (isSaved = true) => {
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
};

export default useUnsavedChangesWarning;
