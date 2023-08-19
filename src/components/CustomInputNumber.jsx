import styled from "styled-components";
import { useRef, useEffect, useState } from "react";

const CustomInput = styled.input`
  text-align: center;
  font-weight: normal;
  font-size: 16px;
  color: rgb(89, 89, 89);
  -webkit-text-fill-color: rgb(89, 89, 89);
  opacity: 1;
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  border: 1px solid rgb(191, 191, 191);
  border-radius: 4px;
  appearance: none;
  line-height: 37px;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
  }
`;

const Minus = styled.div`
  height: 1px;
  width: 25px;
  background-color: rgb(30, 159, 210);
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const Plus = styled.div`
  position: relative;
  &::before,
  &::after {
    content: " ";
    width: 25px;
    height: 1px;
    background-color: rgb(30, 159, 210);
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 1;
    border-radius: 2px;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  &::after {
    transform: translate(-50%, -50%);
  }
`;

const StyledButton = styled.button`
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  width: 48px;
  height: 48px;
  background-color: white;
  border: 1px solid rgb(30, 159, 210);
  color: rgb(30, 159, 210);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const CustomNumberInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function CustomInputNumber({
  min,
  max,
  step,
  name,
  value,
  disabled,
  onChange,
  onBlur,
  incrementButtonDisabled,
}) {
  const plusIntervalRef = useRef(null);
  const minusIntervalRef = useRef(null);
  const [originalValue, setOriginalValue] = useState(value);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    if (newValue === "") {
      onChange(0);
    } else {
      const parsedValue = Math.floor(Number(newValue));
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        if (parsedValue > max) {
          alert(
            `Invalid number. Please enter a number less than or equal to ${max}.`
          );
        } else if (parsedValue < min) {
          onChange(0);
        } else {
          onChange(parsedValue);
        }
      } else {
        alert("Invalid input. Please enter a valid non-negative number.");
      }
    }
  };
  const handleIncrementMouseDown = () => {
    if (!disabled && value < max) {
      if (!plusIntervalRef.current) {
        plusIntervalRef.current = setInterval(() => {
          const newValue = Math.min((value += step), max);
          onChange(newValue);
        }, 120);
      }
    }
  };

  const handleDecrementMouseDown = () => {
    if (!disabled && value > min) {
      if (!minusIntervalRef.current) {
        minusIntervalRef.current = setInterval(() => {
          const newValue = Math.max((value -= step), min);
          onChange(newValue);
        }, 120);
      }
    }
  };

  const handleBlur = (e) => {
    onBlur(e);
    if (value === 0) {
      onChange(originalValue);
    }
  };

  const handleButtonMouseUp = () => {
    clearInterval(plusIntervalRef.current);
    plusIntervalRef.current = null;
    clearInterval(minusIntervalRef.current);
    minusIntervalRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleButtonMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleButtonMouseUp);
      clearInterval(plusIntervalRef.current);
      plusIntervalRef.current = null;
      clearInterval(minusIntervalRef.current);
      minusIntervalRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (disabled || value >= max) {
      clearInterval(plusIntervalRef.current);
      plusIntervalRef.current = null;
    }
    if (disabled || value <= min) {
      clearInterval(minusIntervalRef.current);
      minusIntervalRef.current = null;
    }
  }, [value, max, min]);

  return (
    <CustomNumberInputWrapper>
      <StyledButton
        onMouseDown={handleDecrementMouseDown}
        onMouseUp={handleButtonMouseUp}
        disabled={disabled || value <= min}
      >
        <Minus />
      </StyledButton>
      <CustomInput
        type="number"
        value={value.toString()}
        min={min}
        max={max}
        step={step}
        name={name}
        disabled={disabled}
        onChange={(event) => {
          handleInputChange(event);
          console.log(event.target.name, event.target.value);
        }}
        onBlur={(e) => handleBlur(e)}
      />
      <StyledButton
        onMouseDown={handleIncrementMouseDown}
        onMouseUp={handleButtonMouseUp}
        disabled={disabled || value >= max || incrementButtonDisabled}
      >
        <Plus />
      </StyledButton>
    </CustomNumberInputWrapper>
  );
}

export default CustomInputNumber;
