import { useState } from "react";
import "./stardewStyling.css";

interface Category {
  id: string;
  name: string;
}
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category?: Category;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addTodo = () => {
    if (todoInput != "") {
      const newId = crypto.randomUUID();
      const newTodoItem: TodoItem = {
        id: newId,
        text: todoInput,
        completed: false,
        category: selectedCategory,
      };
      setTodos([...todos, newTodoItem]);
      setTodoInput("");
    }
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const addCategory = () => {
    if (categoryInput != "") {
      const newId = crypto.randomUUID();
      const newCategory: Category = {
        id: newId,
        name: categoryInput,
      };
      setCategories([...categories, newCategory]);
      setCategoryInput("");
    }
  };
  const removeCategory = (category: Category) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.category?.id === category.id) {
        return { ...todo, category: undefined };
      }
      return todo;
    });
    setTodos(updatedTodos);

    const updatedCat = categories.filter((cat) => cat.id != category.id);
    setCategories(updatedCat);
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(undefined);
    }
  };

  const renderTodo = (todo: TodoItem) => (
    <li key={todo.id}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />

      <span className={`todoText ${todo.completed ? "completed" : ""}`}>
        {todo.text}
      </span>

      <button className="removeButton" onClick={() => removeTodo(todo.id)}>
        Remove
      </button>
    </li>
  );

  return (
    <div className="todoDiv">
      <h1>Task Planner</h1>
      <input
        type="text"
        placeholder="Enter a new task"
        value={todoInput}
        onChange={(e) => setTodoInput(e.target.value)}
      />
      <button className="addButton" onClick={addTodo}>
        Add
      </button>

      <button onClick={toggleSettings}>Settings</button>
      <div className="currentCategoryDiv">
        <h3>Current category: </h3>
        <div className="dropdown">
          <button
            className="dropdownButton"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedCategory?.name ?? "No Category"} ▼
          </button>

          {dropdownOpen && (
            <ul className="dropdownMenu">
              <li
                onClick={() => {
                  setSelectedCategory(undefined);
                  setDropdownOpen(false);
                }}
              >
                No Category
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                  }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={settingsOpen ? "settingsOpen" : "settingsClosed"}>
        <div className="newCategoryDiv">
          <input
            type="text"
            value={categoryInput}
            placeholder="Enter category"
            onChange={(e) => setCategoryInput(e.target.value)}
          />
          <button className="addButton" onClick={addCategory}>
            Add
          </button>
        </div>
      </div>

      <ul>{todos.filter((todo) => !todo.category).map(renderTodo)}</ul>

      {categories.map((category) => {
        const categoryTodos = todos.filter(
          (todo) => todo.category?.id === category.id,
        );

        if (categoryTodos.length === 0) {
          return null;
        }
        return (
          <div key={category.id}>
            <h2 className="categoryTitle">{category.name}</h2>
            <ul>
              {todos
                .filter((todo) => todo.category?.id === category.id)
                .map(renderTodo)}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default TodoApp;
