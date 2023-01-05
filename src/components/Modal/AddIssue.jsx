import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { refetchState, todoState } from '../../atoms/store';
import AddIssueInput from '../Input/AddIssueInput';

const MANAGERS = ['윈터', '카리나', '츄', '아이유'];

const AddIssueModal = ({ handleModalToggle, handleSubmit, todoInput, setTodoInput, isupdate, issueId, setIsModal }) => {
  const [todoList] = useRecoilState(todoState);
  const [, setRefetch] = useRecoilState(refetchState);
  const [managerList, setManagerList] = useState([]);
  const [isManagerModal, setIsManagerModal] = useState(false);

  const getIssue = todoList.filter((issue) => issue.id === issueId)[0];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setTodoInput({
      ...todoInput,
      [name]: value,
    });
  };

  const handleIssueDel = () => {
    const todoList = JSON.parse(localStorage.getItem('todo-list') ?? []);

    const updateTodoList = todoList.filter((el) => el.id !== issueId);
    localStorage.setItem('todo-list', JSON.stringify(updateTodoList));
    setRefetch((prev) => prev + 1);
    setIsModal(false);
    alert('이슈가 삭제되었습니다.');
  };

  const handleIssueUpdate = () => {
    const todoList = JSON.parse(localStorage.getItem('todo-list') ?? []);

    const updateTodo = todoList.map((el) => {
      return el.id === issueId
        ? {
            ...el,
            id: el.id,
            title: todoInput.title ?? el.title,
            description: todoInput.description ?? el.description,
            deadline: todoInput.deadline ?? el.deadline,
            status: todoInput.status ?? el.status,
            manager: todoInput.manager ?? el.manager,
          }
        : el;
    });
    localStorage.setItem('todo-list', JSON.stringify(updateTodo));
    setIsModal(false);
    setRefetch((prev) => prev + 1);
    alert('이슈 수정 완료');
  };

  const handleSearchManager = (event) => {
    setManagerList(MANAGERS.filter((el) => el.includes(event.target.value)));
    setTodoInput({
      ...todoInput,
      manager: event.target.value,
    });
    setIsManagerModal(true);
  };

  const handleManagerPick = (event) => {
    setTodoInput({
      ...todoInput,
      manager: event.target.value,
    });
    setManagerList([]);
    setIsManagerModal(false);
  };

  console.log(managerList);

  return (
    <Wrapper>
      <Title>
        <h2> {isupdate ? '이슈 상세' : '이슈 추가'}</h2>
        <CloseBtn onClick={handleModalToggle}>X</CloseBtn>
      </Title>
      <InputBox>
        <InputContainer>
          <InputLabel>제목</InputLabel>
          <Input>
            <AddIssueInput
              type="text"
              name="title"
              defaultValue={isupdate ? getIssue.title : ''}
              onChange={handleChangeInput}
            />
          </Input>
        </InputContainer>
        <InputContainer>
          <InputLabel>내용</InputLabel>
          <Description
            name="description"
            defaultValue={isupdate ? getIssue.description : ''}
            onChange={handleChangeInput}
          />
        </InputContainer>
        <InputContainer>
          <InputLabel>마감일</InputLabel>
          <Input>
            <AddIssueInput
              type="datetime-local"
              defaultValue={isupdate ? getIssue.deadline : ''}
              name="deadline"
              onChange={handleChangeInput}
            />
          </Input>
        </InputContainer>
        <InputContainer>
          <InputLabel>상태</InputLabel>
          <Input>
            <StatusSelect name="status" onChange={handleChangeInput}>
              <option value="">선택해주세요.</option>
              <option selected={isupdate && getIssue.status === 'todo'} value="todo">
                할 일
              </option>
              <option selected={isupdate && getIssue.status === 'inprogress'} value="inprogress">
                진행중
              </option>
              <option selected={isupdate && getIssue.status === 'complete'} value="complete">
                완료
              </option>
            </StatusSelect>
          </Input>
        </InputContainer>
        <InputContainer>
          <InputLabel>담당자</InputLabel>
          <Input>
            <AddIssueInput
              name="manager"
              defaultValue={isupdate && getIssue.manager}
              value={managerList ? todoInput.manager : ''}
              onChange={handleSearchManager}
            />
            {isManagerModal && (
              <ManageList>
                {managerList.length > 0 ? (
                  managerList.map((el) => (
                    <li>
                      <ManagerBtn type="button" value={el} onClick={handleManagerPick}>
                        {el}
                      </ManagerBtn>
                    </li>
                  ))
                ) : (
                  <li>
                    <ManagerBtn type="button" value="" onClick={handleManagerPick}>
                      검색어에 해당하는 담당자가 없습니다.
                    </ManagerBtn>
                  </li>
                )}
              </ManageList>
            )}
          </Input>
        </InputContainer>
      </InputBox>
      <BtnBox>
        <SaveBtn onClick={isupdate ? handleIssueUpdate : handleSubmit}>{isupdate ? '저장' : '추가'}</SaveBtn>
        {isupdate && <SaveBtn onClick={handleIssueDel}>삭제</SaveBtn>}
      </BtnBox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 500px;
  padding: 30px;
  border: 1px solid #bdbdbd;
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: #111;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputBox = styled.div`
  width: 100%;
`;
const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const InputLabel = styled.label`
  width: 30%;
  font-size: 18px;
  font-weight: 400;
  color: #111;
`;

const Input = styled.div`
  width: 70%;
  height: 40px;
  position: relative;
`;

const Description = styled.textarea`
  width: 70%;
  height: 80px;
  outline: none;
  border: 1px solid #bdbdbd;
  resize: none;
  padding: 10px;
`;

const CloseBtn = styled.button`
  font-size: 24px;
  font-weight: 500;
  color: #111;
  border: none;
  background: none;
  cursor: pointer;
`;

const StatusSelect = styled.select`
  width: 100%;
  height: 100%;
  border: 1px solid #bdbdbd;
`;

const BtnBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
`;

const SaveBtn = styled.button`
  display: block;
  width: 70px;
  height: 30px;
  background-color: #111;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const ManageList = styled.ul`
  position: absolute;
  top: 45px;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #bdbdbd;
  li {
    border-bottom: 1px solid #bdbdbd;
    list-style: none;
  }
`;

const ManagerBtn = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
`;

export default AddIssueModal;
