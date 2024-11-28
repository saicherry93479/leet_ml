import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const SessionTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    // Fetch expiry time from API
    const fetchExpiryTime = async () => {
      try {
        const response = await fetch('/api/session-expiry');
        if (!response.ok) {
          throw new Error('Session expired');
        }
        const data = await response.json();
        setExpiryTime(new Date(data.expiryTime));
      } catch (error) {
        console.error('Error fetching session expiry:', error);
        window.location.href = '/logout';
      }
    };

    fetchExpiryTime();
  }, []);

  useEffect(() => {
    if (!expiryTime) return;

    const updateTimer = () => {
      const now = new Date();
      const timeLeft = expiryTime.getTime() - now.getTime();

      if (timeLeft <= 0) {
        setTimeRemaining('Session expired');
        window.location.href = '/logout';
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m left`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m left`);
      } else {
        setTimeRemaining('Less than a minute');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [expiryTime]);

  if (!timeRemaining) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
      <Clock className="h-4 w-4" />
      <span>{timeRemaining}</span>
    </div>
  );
};

export default SessionTimer;