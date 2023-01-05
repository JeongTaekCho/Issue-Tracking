import React from 'react';
import styled from 'styled-components';

const Issue = ({ children, handleIssueView, el, draggable }) => {
  return (
    <IssueBox onClick={el && handleIssueView(el.id)} draggable={draggable}>
      {children}
    </IssueBox>
  );
};

const IssueBox = styled.div`
  width: 100%;
  padding: 8px 10px 6px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  cursor: pointer;
`;

export default Issue;
