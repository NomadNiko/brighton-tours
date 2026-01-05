'use client'
import { useState, useEffect } from 'react';
import { CalendarIcon, UsersIcon, MailIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from 'lucide-react';

export default function BookingEngine({ isOpen, onClose }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [numberOfTourists, setNumberOfTourists] = useState(1);
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDates, setLoadingDates] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDates();
    }
  }, [isOpen]);

  const fetchAvailableDates = async () => {
    setLoadingDates(true);
    try {
      const res = await fetch('/api/bookings/available-dates');
      const data = await res.json();
      setAvailableDates(data.data || []);
    } catch (e) {
      console.error('Failed to fetch dates:', e);
    } finally {
      setLoadingDates(false);
    }
  };

  const getDateInfo = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableDates.find(d => d.date === dateStr);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleDateSelect = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dateInfo = getDateInfo(date);
    if (dateInfo && dateInfo.hasAvailability) {
      setSelectedDate(dateStr);
      setSelectedSlot(null); // Reset slot when date changes
    }
  };

  const handleSlotSelect = (slot) => {
    if (!slot.isFull && slot.remainingSpots >= numberOfTourists) {
      setSelectedSlot(slot);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    if (selectedSlot.remainingSpots < numberOfTourists) {
      setError(`Only ${selectedSlot.remainingSpots} spots available for this time`);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(contactEmail)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot.id, numberOfTourists, contactEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (e) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setNumberOfTourists(1);
    setContactEmail('');
    setError('');
    setSubmitted(false);
    onClose();
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateInfo = selectedDate ? availableDates.find(d => d.date === selectedDate) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Book Your Tour</h2>
            <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600">
              <XIcon className="size-6" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="size-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Booking Request Received</h3>
              <p className="text-amber-600 font-medium mb-2">Tours are not currently running, but will resume soon.</p>
              <p className="text-slate-600 mb-6">We will reach out to {contactEmail} with more information.</p>
              <button onClick={resetAndClose} className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Calendar */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                  <CalendarIcon className="size-4" /> 1. Select a Date
                </label>
                
                {loadingDates ? (
                  <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
                ) : availableDates.length === 0 ? (
                  <div className="h-48 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <div className="text-center text-slate-500">
                      <CalendarIcon className="size-10 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No tours available</p>
                      <p className="text-sm">Check back soon</p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded">
                        <ChevronLeftIcon className="size-5 text-slate-600" />
                      </button>
                      <span className="font-semibold text-slate-900">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded">
                        <ChevronRightIcon className="size-5 text-slate-600" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">{day}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentMonth).map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="h-9" />;
                        
                        const isPast = date < today;
                        const dateInfo = getDateInfo(date);
                        const hasSlots = dateInfo && dateInfo.slots.length > 0;
                        const hasAvailability = dateInfo?.hasAvailability;
                        const isSelected = selectedDate === date.toISOString().split('T')[0];
                        
                        let bgClass = 'bg-slate-100 text-slate-300 cursor-not-allowed';
                        if (!isPast && hasSlots) {
                          if (hasAvailability) {
                            bgClass = isSelected 
                              ? 'bg-sky-500 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer';
                          } else {
                            bgClass = 'bg-red-100 text-red-400 cursor-not-allowed'; // Full
                          }
                        }
                        
                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            disabled={isPast || !hasAvailability}
                            onClick={() => handleDateSelect(date)}
                            className={`h-9 rounded text-sm font-medium transition-colors ${bgClass}`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-slate-600">Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                        <span className="text-slate-600">Full</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
                        <span className="text-slate-600">No tours</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Time Slot Selection */}
              {selectedDate && selectedDateInfo && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <ClockIcon className="size-4" /> 2. Select a Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDateInfo.slots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const canBook = !slot.isFull && slot.remainingSpots >= numberOfTourists;
                      
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!canBook}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50'
                              : canBook
                                ? 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                                : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="font-semibold text-slate-900">{formatTime(slot.startTime)}</div>
                          <div className={`text-sm ${slot.isFull ? 'text-red-500' : 'text-slate-500'}`}>
                            {slot.isFull ? 'FULL' : `${slot.remainingSpots} of ${slot.totalSpots} spots`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Number of Tourists */}
              {selectedSlot && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <UsersIcon className="size-4" /> 3. Number of Tourists
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setNumberOfTourists(Math.max(1, numberOfTourists - 1))}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >-</button>
                    <span className="text-2xl font-bold text-slate-900 w-12 text-center">{numberOfTourists}</span>
                    <button
                      type="button"
                      onClick={() => setNumberOfTourists(Math.min(selectedSlot.remainingSpots, numberOfTourists + 1))}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                    >+</button>
                    <span className="text-sm text-slate-500">(max {selectedSlot.remainingSpots})</span>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Email */}
              {selectedSlot && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <MailIcon className="size-4" /> 4. Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedSlot || availableDates.length === 0}
                className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Submitting...' : 'Book Free Tour'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
