import {
    useEffect,
    useState,
    useMemo,
    useCallback
} from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import "./Transactions.css";
function Transactions() {
    const role = localStorage.getItem("role");
    const [transactions, setTransactions] = useState([]);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        type: "",
        category: ""
    });
    const [currentPage, setCurrentPage] = useState(1);

    const transactionsPerPage = 5;

    useEffect(() => {

        fetchTransactions();

    }, []);

    useEffect(() => {

        setCurrentPage(1);

    }, [search, filterType]);

    const filteredTransactions = useMemo(() => {

        return transactions.filter((transaction) => {

            const matchesSearch =
                transaction.title
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesFilter =
                filterType === "all"
                || transaction.type === filterType;

            return matchesSearch && matchesFilter;

        });

    }, [transactions, search, filterType]);

    const lastIndex =
        currentPage * transactionsPerPage;

    const firstIndex =
        lastIndex - transactionsPerPage;

    const currentTransactions =
        filteredTransactions.slice(
            firstIndex,
            lastIndex
        );

    const totalPages = Math.ceil(
        filteredTransactions.length /
        transactionsPerPage
    );
    const fetchTransactions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/transactions/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTransactions(response.data.transactions);

        } catch (error) {

            console.log(error);

        }
    };

    const handleChange = useCallback((e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    }, [formData]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            if (editId) {

                await API.put(
                    `/transactions/update/${editId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Transaction Updated");

                setEditId(null);

            } else {

                await API.post(
                    "/transactions/add",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                alert("Transaction Added");

            }
            fetchTransactions();
            setFormData({
                title: "",
                amount: "",
                type: "",
                category: ""
            });

        } catch (error) {

            console.log(error);

        }
    };

    const handleEdit = useCallback((transaction) => {

        setEditId(transaction.id);

        setFormData({
            title: transaction.title,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category
        });

    }, []);

    const handleDelete = async (id) => {

        try {

            const token = localStorage.getItem("token");

            await API.delete(
                `/transactions/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Transaction Deleted");

            fetchTransactions();
            setFormData({
                title: "",
                amount: "",
                type: "",
                category: ""
            });

        } catch (error) {

            console.log(error);

        }
    };

    return (

        <div className="transactions-page">

            <Navbar />

            <div className="transactions-container">

                <h1 className="transactions-title">
                    Transactions
                </h1>

                {
                    role !== "read-only" && (

                        <form
                            className="transaction-form"
                            onSubmit={handleSubmit}
                        >

                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={handleChange}
                            />

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Type
                                </option>

                                <option value="income">
                                    Income
                                </option>

                                <option value="expense">
                                    Expense
                                </option>

                            </select>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="Food">
                                    Food
                                </option>

                                <option value="Transport">
                                    Transport
                                </option>

                                <option value="Entertainment">
                                    Entertainment
                                </option>

                                <option value="Shopping">
                                    Shopping
                                </option>

                                <option value="Bills">
                                    Bills
                                </option>

                                <option value="Job">
                                    Job
                                </option>

                            </select>

                            <button type="submit">

                                {
                                    editId
                                        ? "Update Transaction"
                                        : "Add Transaction"
                                }

                            </button>

                        </form>

                    )
                }

                <div className="filters">

                    <input
                        type="text"
                        placeholder="Search Transaction"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(e.target.value)
                        }
                    >

                        <option value="all">
                            All
                        </option>

                        <option value="income">
                            Income
                        </option>

                        <option value="expense">
                            Expense
                        </option>

                    </select>

                </div>

                <div className="transaction-grid">

                    {
                        currentTransactions.map((transaction) => (

                            <div
                                key={transaction.id}
                                className={`transaction-card ${transaction.type === "income"
                                        ? "income-card"
                                        : "expense-card"
                                    }`}
                            >

                                <h3>
                                    {transaction.title}
                                </h3>

                                <p>
                                    <strong>Amount:</strong>
                                    ₹ {transaction.amount}
                                </p>

                                <p>
                                    <strong>Type:</strong>
                                    {transaction.type}
                                </p>

                                <p>
                                    <strong>Category:</strong>
                                    {transaction.category}
                                </p>

                                {
                                    role !== "read-only" && (

                                        <div className="card-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(transaction)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(transaction.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )
                                }

                            </div>

                        ))
                    }

                </div>

                <div className="pagination">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(currentPage - 1)
                        }
                    >
                        Prev
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage(currentPage + 1)
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Transactions;