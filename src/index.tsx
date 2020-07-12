import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { setPriority } from 'os';
import { on } from 'cluster';

//ToDoの型を定義
interface Todo {
    id: number;
    name: string;
  }
  
//ToDoListItemのpropsの型定義
  interface TodoListItemProps {
    todo: Todo;//やること
    onDelete: (todo: Todo) => void;//削除
  }
  
  //ListItemの中身
  const TodoListItem: React.FunctionComponent<TodoListItemProps> = ({
    todo,
    onDelete
  }) => {
    const onClick = () => {
      onDelete(todo);
    };
  
    return (
      <li>
        {todo.name} <button onClick={onClick}>Delete</button>
      </li>
    );
  };
  
  // ListのPropsの型定義
  interface TodosListProps {
    todos: Todo[];
    onDelete: (todo: Todo) => void;
  }
  // List全体
  const TodosList: React.FunctionComponent<TodosListProps> = ({
    todos,
    onDelete
  }) => (
    <ul>
      {todos.map(todo => (
        <TodoListItem todo={todo} key={todo.id} onDelete={onDelete} />
      ))}
    </ul>
  );
  
  // 新しいItemのPropsの型定義
  interface NewTodoFormProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    todo: Todo;
  }
  
  // 新しいItemの中身
  const NewTodoForm: React.FunctionComponent<NewTodoFormProps> = ({
    onChange,
    onAdd,
    todo
  }) => (
    <form onSubmit={onAdd}>
      <input onChange={onChange} value={todo.name} />
      <button type="submit">Add a todo</button>
    </form>
  );
  
  // ***************************************
  // Todoリスト本体部分
  // ***************************************
  // 状態(State)の型定義
  interface State {
    newTodo: Todo;
    todos: Todo[];
  }
  
  class App extends React.Component<{}, State> {
    state = {
      newTodo: {
        id: 1,
        name: ""
      },
      todos: []
    };
  
    render() {
      return (
        <div>
          <h2>React + TypeScript Todoリスト</h2>
          <NewTodoForm
            todo={this.state.newTodo}
            onAdd={this.addTodo}
            onChange={this.handleTodoChange}
          />
          <TodosList todos={this.state.todos} onDelete={this.deleteTodo} />
        </div>
      );
    }
  
    // Todoの追加
    private addTodo = (event: React.FormEvent<HTMLFormElement>) => {
      // デフォルトの送信機能を使わない
      event.preventDefault();
  
      // 空なら処理を止める
      if (!this.state.newTodo.name.length) {
        return;
      }
  
      // TodoリストStateの更新、引数には現在(更新前)のStateが入ってくる
      this.setState(previousState => ({
        newTodo: {
          id: previousState.newTodo.id + 1,
          name: ""
        },
        // 現在のTODOの配列と、新しいTODOを結合する
        todos: [...previousState.todos, previousState.newTodo]
      }));
    };
  
    // フォームの内容が変わったらnewTodoの内容も変える
    private handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputedValue = event.target.value;
  
      this.setState({
        newTodo: {
          ...this.state.newTodo,
          name: inputedValue
        }
      });
    };
  
    // Todoの削除
    private deleteTodo = (todoToDelete: Todo) => {
      this.setState(previousState => ({
        todos: [
          ...previousState.todos.filter(todo => todo.id !== todoToDelete.id)
        ]
      }));
    };
  }
  
  ReactDOM.render(<App />, document.getElementById("root"));