import { createContext, useContext, useReducer, type ReactNode } from "react";
import { type Todo } from "../types/Todo";

type TodoAction =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } };

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "ADD_TODO":
      const newTodo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        createdAt: new Date(),
      };
      return [newTodo, ...state];
    case "TOGGLE_TODO":
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload.id);

    default:
      return state;
  }
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  const addTodo = (text: string) => {
    dispatch({ type: "ADD_TODO", payload: { text } });
  };
  const toggleTodo = (id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: { id } });
  };
  const deleteTodo = (id: string) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  };

  const value = { todos, addTodo, toggleTodo, deleteTodo };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const context = useContext(TodoContext);

  if (context === null) {
    throw new Error("useTodos must be used within a TodoProvider");
  }

  return context;
}
