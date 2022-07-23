import { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { addToDo, fetchToDoList, addToDoList } from './store/features/todoSlice';

function App() {

  const items = useSelector((state) => state.todos.items[0]);
  const dispatch = useDispatch();

  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {items ? items.map((item) => (
            <li key={item._id}>{item.label}</li>
          ))
            : null}
        </ul>
      </header>
    </div>
  );
}

export default App;
