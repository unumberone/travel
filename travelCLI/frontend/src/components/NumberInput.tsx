import React, { useState } from "react";

interface NumberInputProps {
  value: string | number;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  style?: React.CSSProperties;
}

const formatNumber = (val: string | number) => {
  if (!val || isNaN(Number(val))) return "";
  return Number(val).toLocaleString("vi-VN");
};

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  name,
  placeholder,
  className,
  min,
  max,
  style,
}) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 1) val = val.replace(/^0+/, "");
    if (val.length === 0) val = "0";
    onChange(val);
  };

  return (
    <input
      type="text"
      name={name}
      className={className}
      placeholder={placeholder}
      value={formatNumber(value)}
      min={min}
      max={max}
      style={style}
      inputMode="numeric"
      pattern="[0-9]*"
      onChange={handleChange}
      autoComplete="off"
    />
  );
};

export default NumberInput;