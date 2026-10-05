import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export default function ReviewForm({ productId, onSubmitted }) {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('Please login to write a review.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(apiUrl(`/api/products/${productId}/reviews`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authToken: token },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add review');
      setComment('');
      onSubmitted && onSubmitted(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium">Rating</label>
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="p-2 border rounded">
          {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Comment</label>
        <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full p-2 border rounded" rows={3} />
      </div>
      <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">{loading? 'Submitting...' : 'Submit Review'}</button>
    </form>
  );
}
