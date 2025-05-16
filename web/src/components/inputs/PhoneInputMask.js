import { IMaskInput } from "react-imask";

const PHONE_MASK = "+{7} (000) 000-00-00";

  function PhoneInputMask(props) {
    const { inputRef, onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={PHONE_MASK}
        ref={inputRef}
        onAccept={(value) => {
          onChange({ target: { value } })
        }}
        overwrite
        placeholder="+7 (___) ___-__-__"
      />
    );
  }

export default PhoneInputMask