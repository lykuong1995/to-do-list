"use client";

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type Todo = {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTodos();

    const channel = supabase.channel('todos-realtime').on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'todos',
      },
      (payload: any) => {
        fetchTodos();
      }
    );

    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        console.log('Real-time subscription active');
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('/api/todo');
    const data = await response.json();
    setTodos(data);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmedValue = inputValue.trim();

      if (trimmedValue === '') {
        alert('Todo cannot be empty');
        return;
      }

      if (editingId) {
        const duplicate = todos.find(
          (todo) => todo.todo.toLowerCase() === trimmedValue.toLowerCase() && todo.id !== editingId
        );

        if (duplicate) {
          alert('This todo already exists!');
          return;
        }

        await fetch(`/api/todo/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            todo: trimmedValue,
            isCompleted: todos.find(t => t.id === editingId)?.isCompleted || false,
          }),
        });

        setEditingId(null);
      } else {
        const duplicate = todos.find(
          (todo) => todo.todo.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (duplicate) {
          alert('This todo already exists!');
          return;
        }

        await fetch('/api/todo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            todo: trimmedValue,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          }),
        });
      }

      setInputValue('');
      setFilterText('');
      fetchTodos();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todo/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setInputValue(todo.todo);
    setFilterText('');
    inputRef.current?.focus();
  };

  const handleToggleComplete = async (todo: Todo) => {
    await fetch(`/api/todo/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: todo.todo,
        isCompleted: !todo.isCompleted,
      }),
    });
    fetchTodos();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!editingId) {
      setFilterText(value);
    }
  };

  const filteredTodos = filterText.trim() === '' && !editingId
    ? todos
    : todos.filter((todo) =>
        todo.todo.toLowerCase().includes(filterText.toLowerCase())
      );

  const showNoResults = filterText.trim() !== '' && !editingId && filteredTodos.length === 0;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Todo List</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={editingId ? 'Edit todo and press Enter...' : 'Type a todo and press Enter to add...'}
          style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        />
        <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
          {editingId ? 'Press Enter to save changes' : 'Press Enter to add a new todo. Start typing to filter existing todos.'}
        </p>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {showNoResults ? (
          <li style={{ padding: '10px', color: '#666' }}>
            No result. Create a new one instead!
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              onMouseEnter={() => setHoveredId(todo.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  textDecoration: todo.isCompleted ? 'line-through' : 'none',
                  flex: 1,
                }}
              >
                {todo.todo}
              </span>

              {hoveredId === todo.id && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handleToggleComplete(todo)}>
                    {todo.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                  <button onClick={() => handleEdit(todo)} className={todo.isCompleted ? 'd-none' : ''}>Edit</button>
                  <button onClick={() => handleDelete(todo.id)}>Remove</button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
