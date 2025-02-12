import axios from "axios";
import { useState } from "react";

export default function CreateBooking() {
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [partySize, setPartySize] = useState(0);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  async function handleDateTimeSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!bookingDate || !bookingTime || partySize <= 0) {
      setError("Alla fält måste fyllas i.");
      return;
    }

    try {
      const requestedDateTime = new Date(
        `${bookingDate}T${bookingTime}:00`
      ).toISOString();

      const response = await axios.get(
        "https://4a63-83-254-228-245.ngrok-free.app/getavailabletables",
        {
          params: {
            requestedDateTime,
            partySize,
          },
        }
      );

      setAvailableTables(response.data);
      setStep(2);
    } catch (error) {
      setError("Ett fel inträffade vid hämtning av tillgängliga bord. Försök igen.");
    }
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !customerFirstName ||
      !customerLastName ||
      !customerEmail ||
      !customerPhone ||
      !selectedTable
    ) {
      setError("Alla fält måste fyllas i.");
      return;
    }

    try {
      const requestedDateTime = new Date(
        `${bookingDate}T${bookingTime}:00`
      ).toISOString();
      const booking = {
        partySize,
        requestedDateTime,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhone,
        tableId: selectedTable,
      };

      await axios.post(
        "https://4a63-83-254-228-245.ngrok-free.app/makenewbooking",
        booking
      );

      setSuccess("Din bokning är genomförd!");
      setStep(1);
      setBookingDate("");
      setBookingTime("");
      setPartySize(0);
      setCustomerFirstName("");
      setCustomerLastName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setSelectedTable("");
    } catch (error) {
      setError("Ett fel inträffade vid bokningen. Försök igen.");
    }
  }

  return (
    <div className="main-container w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-medium text-gray-800 mb-6">
          Bordsbokning
        </h1>
        {step === 1 && (
          <form onSubmit={handleDateTimeSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Datum
              </label>
              <input
                type="date"
                id="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tid
              </label>
              <input
                type="time"
                id="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="partySize"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Antal personer
              </label>
              <input
                type="number"
                id="partySize"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sök tillgängliga bord
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Förnamn
              </label>
              <input
                type="text"
                id="firstName"
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Efternamn
              </label>
              <input
                type="text"
                id="lastName"
                value={customerLastName}
                onChange={(e) => setCustomerLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-post
              </label>
              <input
                type="email"
                id="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefonnummer
              </label>
              <input
                type="tel"
                id="phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="table"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Välj bord
              </label>
              <select
                id="table"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Välj ett bord</option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    Bord {table.id} - {table.capacity} personer
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Boka bord
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
