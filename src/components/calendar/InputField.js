// components/InputField.jsx
import React from 'react';

const InputField = ({ label, value, onChange, type = 'text', ...rest }) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      {...rest}
    />
  </div>
);

export default InputField;