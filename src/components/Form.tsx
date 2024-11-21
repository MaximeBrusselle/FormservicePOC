import { useState } from "react";
import type { FormEvent } from "react";

export default function Form() {
    const [responseMessage, setResponseMessage] = useState("");

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch("/api/feedback", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.message) {
            setResponseMessage(data.message);
        }
    }

    return (
        <form
            onSubmit={submit}
            className="w-full max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md space-y-6"
        >
            <label htmlFor="name" className="block">
                <span className="block text-sm font-medium text-gray-300">
                    Name
                </span>
                <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    className="mt-1 w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </label>

            <label htmlFor="email" className="block">
                <span className="block text-sm font-medium text-gray-300">
                    Email
                </span>
                <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="mt-1 w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </label>

            <label htmlFor="message" className="block">
                <span className="block text-sm font-medium text-gray-300">
                    Message
                </span>
                <textarea
                    id="message"
                    name="message"
                    autoComplete="off"
                    required
                    className="mt-1 w-full px-4 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </label>

            <button
                type="submit"
                className="w-full py-2 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
                Send
            </button>

            {responseMessage && (
                <p className="text-sm text-center text-green-400">
                    {responseMessage}
                </p>
            )}
        </form>
    );
}
