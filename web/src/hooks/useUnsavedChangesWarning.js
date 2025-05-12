import { useEffect } from 'react';
import { useBlocker } from 'react-router';

const UNSAVE_ALERT_MESSAGE = 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти?';

const useUnsavedChangesWarning = (isSaved = true) => {

  useBlocker((props) => {
    if (isSaved) return false;

    const params = new URLSearchParams(props.nextLocation.search);
    const ignoreUnsavedChanges = params.get('ignoreUnsavedChanges');

    if (ignoreUnsavedChanges == "true") {
      return false;
    }

    return !window.confirm(UNSAVE_ALERT_MESSAGE);
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

}

export default useUnsavedChangesWarning;
