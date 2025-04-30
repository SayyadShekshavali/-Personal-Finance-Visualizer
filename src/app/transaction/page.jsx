"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Logo from "@/images/applogo.png";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transaction/history");
        const data = await res.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    }

    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/transactions/delete/${id}`, {
        method: "DELETE",
      });
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <div className="w-full">
      <Toaster />
      <div className="bg-blue-100 w-full">
        <div className="flex items-center w-full border-0 border-black bg-blue-100">
          <Image className="h-10 w-10 md:h-20 md:w-20" src={Logo} alt="logo" />
          <Link
            href="/"
            className="lg:ml-10 font-bold lg:text-xl hover:bg-gray-100 p-2 rounded-md"
          >
            Overview
          </Link>
          <Link
            href="/transaction"
            className="lg:ml-6 font-bold lg:text-xl hover:bg-gray-100 p-2 rounded-md"
          >
            Transactions
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-center mt-4 rounded-xl overflow-auto bg-transparent w-full">
        {Array.isArray(transactions) && transactions.length > 0 ? (
          <>
            <p className="text-2xl font-bold text-black pt-6 text-center underline m-4">
              Histrory
            </p>
            {transactions.map((txn) => (
              <div
                key={txn._id}
                className="flex items-center justify-between h-15 border-b border-black lg:w-[70%] w-full mx-auto p-2 rounded-xl shadow-md"
              >
                <p className="lg:text-xl ;g:mx-3">₹{txn.amount}</p>
                <p className="lg:text-xl lg:mx-3">{txn.description}</p>
                <p className="lg:text-xl lg:mx-3">
                  {new Date(txn.date).toLocaleDateString("en-IN")}
                </p>
                <div className="flex">
                  <Button
                    onClick={() => handleDelete(txn._id)}
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
    </div>
  );
}
