import React from 'react';
import styled from 'styled-components';

const AddIssueInput = ({ type, name, onChange, value, defaultValue }) => {
  return <Input type={type} name={name} onChange={onChange} value={value} defaultValue={defaultValue} />;
};

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: 1px solid #bdbdbd;
  outline: none;
  padding: 10px;
`;

export default AddIssueInput;
