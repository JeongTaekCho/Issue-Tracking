import React, { useCallback, useEffect, useState } from 'react';
import uuid from 'react-uuid';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { refetchState, todoState } from '../atoms/store';
import Issue from '../components/Issue';
import AddIssueModal from '../components/Modal/AddIssue';

const Board = () => {
  const [todoInput, setTodoInput] = useState({
    id: uuid(),
    title: '',
    description: '',
    deadline: '',
    status: '',
    manager: '',
  });
  const [isModal, setIsModal] = useState(false);
  const [todoList, setTodoList] = useRecoilState(todoState);
  const [refetch, setRefetch] = useRecoilState(refetchState);
  const [isupdate, setIsUpdate] = useState(false);
  const [issueId, setIssueId] = useState('');
  const [isDraging, setIsDraging] = useState(false);

  const getTodoList = useCallback(() => {
    const TodoList = JSON.parse(localStorage.getItem('todo-list') ?? []);

    setTodoList(TodoList);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('todo-list')) {
      getTodoList();
    }
  }, [refetch]);

  const TODO = todoList.filter((el) => el.status === 'todo');
  const INPROGRESS = todoList.filter((el) => el.status === 'inprogress');
  const COMPLETE = todoList.filter((el) => el.status === 'complete');

  const handleModalToggle = () => {
    setIsModal((prev) => !prev);
    setIsUpdate(false);
  };

  const handleIssueView = (issueId) => () => {
    setIsUpdate(true);
    setIsModal(true);
    setIssueId(issueId);
  };

  const handleOnDragbled = (event) => {
    console.log(event);
    setIsDraging(true);
  };

  const handleSubmit = () => {
    try {
      if (todoInput.title && todoInput.description && todoInput.deadline && todoInput.status && todoInput.manager) {
        const TodoList = JSON.parse(localStorage.getItem('todo-list')) ?? [];
        TodoList.push(todoInput);

        localStorage.setItem('todo-list', JSON.stringify(TodoList));
        setTodoInput('');
        setRefetch((prev) => prev + 1);
        setIsModal(false);

        alert('등록완료');
      } else {
        alert('빈칸을 채워주세요.');
      }
    } catch (error) {
      alert('실패');
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>Issue Tracking</Title>
        <IssueBox>
          <TodoBox>
            <BoxTitle>
              <span>할 일</span> <AddIssueBtn onClick={handleModalToggle}>+</AddIssueBtn>
            </BoxTitle>
            <ContentBox>
              {TODO.length === 0 && (
                <Issue>
                  <AddIssuwBox onClick={handleModalToggle}>추가 +</AddIssuwBox>
                </Issue>
              )}
              {TODO.map((el) => {
                return (
                  <Issue
                    handleOnDragbled={handleOnDragbled}
                    handleIssueView={handleIssueView}
                    style={{ border: isDraging && '1px solid red' }}
                    el={el}
                    key={el.id}
                    draggable>
                    {el.title}
                  </Issue>
                );
              })}
            </ContentBox>
          </TodoBox>
          <InProgressBox>
            <BoxTitle>
              <span>진행중</span>
            </BoxTitle>
            <ContentBox>
              {INPROGRESS.map((el) => {
                return (
                  <Issue handleIssueView={handleIssueView} el={el} key={el.id} draggable>
                    {el.title}
                  </Issue>
                );
              })}
            </ContentBox>
          </InProgressBox>
          <CompleteBox>
            <BoxTitle>
              <span>완료</span>
            </BoxTitle>
            <ContentBox>
              {COMPLETE.map((el) => {
                return (
                  <Issue handleIssueView={handleIssueView} el={el} key={el.id} draggable>
                    {el.title}
                  </Issue>
                );
              })}
            </ContentBox>
          </CompleteBox>
        </IssueBox>
      </Container>
      {isModal && (
        <AddIssueModal
          handleModalToggle={handleModalToggle}
          handleSubmit={handleSubmit}
          todoInput={todoInput}
          setTodoInput={setTodoInput}
          isupdate={isupdate}
          issueId={issueId}
          setIsModal={setIsModal}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 960px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #111;
  margin-bottom: 100px;
`;

const IssueBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TodoBox = styled.div`
  width: 32%;
`;
const InProgressBox = styled(TodoBox)``;
const CompleteBox = styled(TodoBox)``;

const BoxTitle = styled.h2`
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  color: #111;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddIssuwBox = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  color: orange;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const AddIssueBtn = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  font-size: 24px;
`;

export default Board;
