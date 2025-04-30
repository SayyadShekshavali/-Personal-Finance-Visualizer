"use client";
import Image from "next/image";
import Logo from "@/images/applogo.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";

import { useEffect } from "react";
export default function Home() {
  const [editId, setEditId] = useState(null);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);
  const Edit = (txn) => {
    setAmount(txn.amount);
    setDate(txn.date.slice(0, 10));
    setDescription(txn.description);
    setEditId(txn._id);
    console.log("Edit ID:", editId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }
    if (!amount || !date || !description) {
      toast.error("All fields must be filled");
      return;
    }

    try {
      let response;

      if (editId) {
        response = await fetch(`/api/transaction/edit?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, date, description }),
        });
      } else {
        response = await fetch("/api/transaction/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount), date, description }),
        });
      }

      if (!response.ok) {
        const errMsg = await response.json();
        toast.error(errMsg?.message || "Failed to save transaction");
        return;
      }

      toast.success(editId ? "Transaction updated" : "Transaction added");

      setAmount("");
      setDate("");
      setDescription("");
      setEditId(null);

      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing the transaction");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transaction/history");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched transactions:", data);
        setTransactions(data.transactions);
      } else {
        toast.error("Failed to load transactions");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching transactions");
    }
  };

  const Delete = async (id) => {
    try {
      const res = await fetch(`/api/transaction/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Transaction deleted");
        fetchTransactions();
      } else {
        const msg = await res.json();
        toast.error(msg?.error || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting");
    }
  };
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/transactions/history");
      const data = await res.json();
      setTransactions(data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);
  return (
    <div className="  items-center justify-center w-full">
      <Toaster />
      <div className=" bg-blue-100 lg:h-90 md:h-70 h-50 w-full ">
        <div className=" flex lg:h-20 h-10 w-full border-0 border-black bg-blue-0 items-center bg-blue-100">
          <Image
            className="lg:h-30 lg:w-30 h-10 w-10 md:h-20 md:w-20 items-center justify-center"
            src={Logo}
            alt="logo"
          />
          <Link
            href="/"
            className="lg:ml-40 md:ml-30 font-bold lg:text-xl hover:bg-gray-100 lg:p-3 p-2 hover:rounded-md hover:border-black "
          >
            {" "}
            Overview
          </Link>
          <Link
            href="/transaction"
            className="lg:ml-10 md:ml-10 font-bold lg:text-xl hover:bg-gray-100 lg:p-3 p-2 hover:rounded-md hover:border-black "
          >
            {" "}
            Transactions
          </Link>
          <Link
            href="#bar"
            className="lg:ml-10 md:ml-10 font-bold lg:text-xl hover:bg-gray-100 lg:p-3 p-2 hover:rounded-md hover:border-black "
          >
            {" "}
            Monthly Expenses
          </Link>
        </div>
      </div>
      <form
        className="flex flex-col lg:h-auto md:h-auto h-auto w-[70%]items-center  justify-center border-0 border-black lg:mx-70 md:mx-50 mx-10 lg:-mt-32 md:-mt-25 -mt-17 bg-white rounded-3xl shadow-2xl z-10 "
        onSubmit={handleSubmit}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Input
          className=" m-2 p-1 lg:h-10 lg:w-auto md:h-8"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter money "
        />
        <Input
          className="m-1  p-1"
          type="date"
          placeholder="Date "
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          className=" m-2 p-2"
          type="text"
          placeholder="Description "
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          type="submit"
          className=" m-1 px-1 bg-red-200 lg:h-10 rounded-xl hover:bg-red-300 "
        >
          Add
        </Button>
      </form>
      <div className="flex w-full flex-col ">
        <div className=" flex flex-col justify-center h-100 lg:w-full border-0 border-black lg:-mt-0 md:-mt-0 -mt-0 rounded-xl overflow-scroll bg-transparent">
          {Array.isArray(transactions) && transactions.length > 0 ? (
            <>
              <p className="!text-2xl !font-bold !text-black !pt-30 text-center underline !m-4">
                Recent Transactions
              </p>
              {transactions.map((txn) => (
                <div
                  key={txn._id}
                  className="flex items-center justify-between h-15 border-b border-black lg:w-[70%] md:w-[70%] w-[100%]  sm:mx-auto  p-0 border-0 border-black rounded-xl shadow-xl m-1 "
                >
                  <p className="lg:text-xl mx-3">₹{txn.amount}</p>
                  <p className="lg:text-xl mx-3">
                    {new Date(txn.date).toLocaleDateString("en-IN")}
                  </p>
                  <div className="flex">
                    <Button
                      onClick={() => Edit(txn)}
                      className="m-1 bg-yellow-300 "
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => Delete(txn._id)}
                      className="m-1 bg-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-center p-4">No transactions available</p>
          )}
        </div>
        <div
          id="bar"
          className=" lg:w-full flex flex-col justify-center p-4 bg-white rounded-xl shadow-md mt-10 border-1 border-black"
        >
          <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
          <MonthlyExpensesChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
