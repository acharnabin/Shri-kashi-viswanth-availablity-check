import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Geist font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// getServerSideProps function to call the internal API
export async function getServerSideProps(context) {
  const { query } = context;
  const selectedDate = query.date || new Date().toISOString().split("T")[0]; // Default to today's date

  try {
    // Use axios to make the GET request to the internal API on the same origin
    const res = await axios.get(`/api/checkAvailability`, {
      params: { date: selectedDate }, // Pass date as query parameter
    });

    const data = res.data; // Access the response data directly

    return {
      props: {
        availabilityStatus: data.status || "error", // Default to error if not provided
        selectedDate,
      },
    };
  } catch (error) {
    console.error("Error fetching availability:", error);
    return {
      props: {
        availabilityStatus: "error", // If there's an error, set status to "error"
        selectedDate,
      },
    };
  }
}

export default function Home({ availabilityStatus, selectedDate }: any) {
  const router = useRouter();
  const [date, setDate] = useState(selectedDate);

  // Handle the form submission to change the date
  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      router.push(`/?date=${date}`); // Reload the page with the selected date
    }
  };

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}>
      <h1 className="text-2xl font-bold">Book Button</h1>

      {/* Date selection form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <label className="text-sm font-medium">
          Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="ml-2 border rounded p-2"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {/* Display availability status */}
      {availabilityStatus && (
        <div className="mt-8 text-lg">
          {availabilityStatus === "available" ? (
            <span className="text-green-500">Available</span>
          ) : availabilityStatus === "not available" ? (
            <span className="text-red-500">Not Available</span>
          ) : (
            <span className="text-yellow-500">Error: {availabilityStatus}</span>
          )}
        </div>
      )}
    </div>
  );
}
