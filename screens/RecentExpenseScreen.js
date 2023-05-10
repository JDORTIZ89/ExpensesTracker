import { StyleSheet } from "react-native";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useContext, useEffect, useState } from "react";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenseScreen() {
  const [isFetching, setIsFetching] = useState(true);

  const [error, setError] = useState();

  const expensesCTX = useContext(ExpensesContext);

  // const [fetchedExpenses, setFetchedExpenses] = useState([]);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);

      try {
        const expenses = await fetchExpenses();
        expensesCTX.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses");
      }
      setIsFetching(false);

      // setFetchedExpenses(expenses);
    }

    getExpenses();
  }, []);

  function errorHandler() {
    setError(null);
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={setError} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCTX.expenses.filter((expenses) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expenses.date >= date7DaysAgo && expenses.date <= today;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="No expenses registered for the last 7 days"
    />
  );
}

export default RecentExpenseScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#3d03aa",
    fontWeight: "bold",
  },
  innerContainer: {
    textAlign: "center",
    color: "#333333",
  },
  buttonStyle: {
    padding: 18,
    marginTop: 50,
  },
});
