
import React, { createContext, useContext, useReducer, useCallback, ReactNode, useMemo } from 'react';
import { User, UserState, UserAction, UserContextType } from './types';

const initialState: UserState = {
  users: [],
  loading: true,
  error: null,
  searchTerm: '',
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false, error: null };
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.payload.id ? action.payload : u)),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const refreshUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const usersWithImages = data.map((user: User) => ({
        ...user,
        imageUrl: `https://picsum.photos/seed/${user.id}/400`,
      }));
      dispatch({ type: 'SET_USERS', payload: usersWithImages });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400`,
    };
    dispatch({ type: 'ADD_USER', payload: newUser });
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const deleteUser = useCallback((id: number) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  const filteredUsers = useMemo(() => {
    return state.users
      .filter((user) => {
        const term = state.searchTerm.toLowerCase();
        return (
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.company?.name && user.company.name.toLowerCase().includes(term))
        );
      });
  }, [state.users, state.searchTerm]);

  return (
    <UserContext.Provider value={{ 
      ...state, 
      addUser, 
      updateUser, 
      deleteUser, 
      refreshUsers, 
      setSearchTerm, 
      filteredUsers 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
