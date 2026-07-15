import {
    useEffect,
    useState,
    useMemo,
    useCallback
} from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import "./Transactions.css";

function Transactions() {
    const role = localStorage.getItem("role");
    const isAdmin = role === "admin";
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

    const currentDate = new Date();

    const [month, setMonth] = useState(
        currentDate.getMonth() + 1
    );

    const [year, setYear] = useState(
        currentDate.getFullYear()
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchTransactions();

    }, [month, year]);

    useEffect(() => {

        setCurrentPage(1);

    }, [search, filterType, month, year]);

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

        setLoading(true);

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                `/transactions/all?month=${month}&year=${year}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTransactions(
                response.data.transactions
            );

        } catch (error) {

            toast.error(
                "Something went wrong"
            );

        } finally {

            setLoading(false);

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
            if (
                !formData.title.trim() ||
                !formData.amount ||
                !formData.type ||
                !formData.category
            ) {
                toast.error("All fields are required");
                setLoading(false);
                return;
            }

            if (formData.amount <= 0) {
                toast.error("Amount must be greater than 0");
                setLoading(false);
                return;
            }

            if (formData.title.trim().length < 3) {
                toast.error("Title must be at least 3 characters");
                setLoading(false);
                return;
            }
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

                toast.success("Transaction updated successfully");

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

                toast.success("Transaction added successfully");

            }
            fetchTransactions();
            setFormData({
                title: "",
                amount: "",
                type: "",
                category: ""
            });

        } catch (error) {

            // console.log(error);
            toast.error("Something went wrong");

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

            toast.success("Transaction deleted successfully");

            fetchTransactions();
            setFormData({
                title: "",
                amount: "",
                type: "",
                category: ""
            });

        } catch (error) {

            // console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (

        <div className="transactions-page">

            <Navbar />

            <div className="transactions-container">

                {/* TITLE */}

                <h1 className="transactions-title">

                    {
                        isAdmin
                            ? "All User Transactions"
                            : "My Transactions"
                    }

                </h1>

                {/* ADMIN BANNER */}

                {
                    isAdmin && (

                        <div className="admin-banner">

                            <div>

                                <h2>
                                    Admin Transaction Access
                                </h2>

                                <p>
                                    You can manage all user transactions
                                </p>

                            </div>

                            <span className="admin-badge">
                                ADMIN
                            </span>

                        </div>

                    )
                }

                {/* FORM */}

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

                {/* FILTERS */}

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


                    {/* MONTH FILTER */}

                    <select
                        value={month}
                        disabled={loading}
                        onChange={(e) =>
                            setMonth(Number(e.target.value))
                        }
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>


                    {/* YEAR FILTER */}

                    <select
                        value={year}
                        disabled={loading}
                        onChange={(e) =>
                            setYear(Number(e.target.value))
                        }
                    >
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                    </select>

                </div>

                {/* TRANSACTION GRID */}


                <div className="transaction-grid">

                    {
                        loading
                            ? (
                                <div className="no-data">
                                    <p>Loading transactions...</p>
                                </div>
                            )
                            : currentTransactions.length > 0
                                ? (
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

                                            {/* ADMIN USER INFO */}

                                            {
                                                isAdmin && (

                                                    <div className="admin-user-info">

                                                        <p>
                                                            <strong>User:</strong>
                                                            {transaction.name}
                                                        </p>

                                                        <p>
                                                            <strong>Email:</strong>
                                                            {transaction.email}
                                                        </p>

                                                    </div>

                                                )
                                            }

                                            <p>
                                                <strong>Amount:</strong>
                                                ₹ {transaction.amount}
                                            </p>

                                            <p>
                                                <strong>Type:</strong>

                                                <span
                                                    className={
                                                        transaction.type === "income"
                                                            ? "type-badge income-badge"
                                                            : "type-badge expense-badge"
                                                    }
                                                >
                                                    {transaction.type}
                                                </span>
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
                                )
                                : (
                                    <div className="no-data">
                                        No transactions found for this month 🚫
                                    </div>
                                )
                    }

                </div>
                {/* PAGINATION */}

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