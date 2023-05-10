import { createContext, useReducer, useState } from "react";

// const DUMMY_Expenses = [
//   {
//     id: "e1",
//     description: "A pair of shoes",
//     amount: 59.99,
//     date: new Date("2021-12-19"),
//   },
//   {
//     id: "e2",
//     description: "A pair of shorts",
//     amount: 89.29,
//     date: new Date("2022-01-19"),
//   },
//   {
//     id: "e3",
//     description: "Bananas",
//     amount: 5.99,
//     date: new Date("2021-12-01"),
//   },
//   {
//     id: "e4",
//     description: "A Book",
//     amount: 14.99,
//     date: new Date("2022-06-19"),
//   },
//   {
//     id: "e5",
//     description: "Mountain Bike",
//     amount: 5149.99,
//     date: new Date("2022-12-19"),
//   },
//   {
//     id: "e6",
//     description: "Smoker",
//     amount: 5149.99,
//     date: new Date("2022-12-19"),
//   },
//   {
//     id: "e7",
//     description: "Minivan",
//     amount: 35195.95,
//     date: new Date("2023-05-04"),
//   },
//   {
//     id: "e8",
//     description: "Tools",
//     amount: 325.0,
//     date: new Date("2023-05-09"),
//   },
// ];

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  setExpenses: (expenses) => {},
  deleteExpense: (id) => {},
  updateExpense: (id, { description, amount, date }) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // const id = new Date().toString() + Math.random().toString();
      return [{ ...action.payload}, ...state];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = { ...updatableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case "DELETE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }

  function addExpense(expenseData) {
    dispatch({ type: "ADD", payload: expenseData });
  }

  function deleteExpense(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateExpense(id, expenseData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: expenseData } });
  }

  const value = {
    expenses: expensesState,
    setExpenses: setExpenses,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
