import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import booksData from '../data/books.json';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import { getAllUsers } from '../services/userService';

const ADMIN_EMAIL = 'ghosalushnish@gmail.com';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'books' | 'orders' | 'users'>('books');
  const [books, setBooks] = useState(booksData);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    image: '',
    description: '',
    isbn: '',
    pages: '',
    language: '',
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (tab === 'orders') {
      getAllOrders().then(setOrders);
    }
    if (tab === 'users') {
      getAllUsers().then(setUsers);
    }
  }, [tab]);

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="text-gray-600">You are not authorized to view this page.</p>
      </div>
    );
  }

  // Book CRUD handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      pages: Number(form.pages),
    };
    setBooks([newBook, ...books]);
    setForm({ title: '', author: '', category: '', price: '', image: '', description: '', isbn: '', pages: '', language: '' });
  };

  const handleEditBook = (book: any) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: String(book.price),
      image: book.image,
      description: book.description,
      isbn: book.isbn,
      pages: String(book.pages),
      language: book.language,
    });
  };

  const handleUpdateBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooks(books.map(b => b.id === editingBook.id ? { ...editingBook, ...form, price: Number(form.price), pages: Number(form.pages) } : b));
    setEditingBook(null);
    setForm({ title: '', author: '', category: '', price: '', image: '', description: '', isbn: '', pages: '', language: '' });
  };

  const handleDeleteBook = (id: number) => {
    setBooks(books.filter(b => b.id !== id));
  };

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    setOrderStatusUpdating(orderId);
    await updateOrderStatus(orderId, status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled');
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status } : o));
    setOrderStatusUpdating(null);
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setTab('books')} className={`px-4 py-2 rounded ${tab === 'books' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Books</button>
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Orders</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Users</button>
      </div>
      {tab === 'books' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Books</h2>
          <form onSubmit={editingBook ? handleUpdateBook : handleAddBook} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" className="p-2 border rounded" required />
            <input name="author" value={form.author} onChange={handleFormChange} placeholder="Author" className="p-2 border rounded" required />
            <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" className="p-2 border rounded" required />
            <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" className="p-2 border rounded" required />
            <input name="image" value={form.image} onChange={handleFormChange} placeholder="Image URL" className="p-2 border rounded" required />
            <input name="isbn" value={form.isbn} onChange={handleFormChange} placeholder="ISBN" className="p-2 border rounded" required />
            <input name="pages" value={form.pages} onChange={handleFormChange} placeholder="Pages" type="number" className="p-2 border rounded" required />
            <input name="language" value={form.language} onChange={handleFormChange} placeholder="Language" className="p-2 border rounded" required />
            <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" className="p-2 border rounded col-span-1 md:col-span-2" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2">{editingBook ? 'Update Book' : 'Add Book'}</button>
            {editingBook && <button type="button" onClick={() => { setEditingBook(null); setForm({ title: '', author: '', category: '', price: '', image: '', description: '', isbn: '', pages: '', language: '' }); }} className="bg-gray-400 text-white px-4 py-2 rounded col-span-1 md:col-span-2">Cancel</button>}
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Author</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td className="p-2 border">{book.title}</td>
                    <td className="p-2 border">{book.author}</td>
                    <td className="p-2 border">{book.category}</td>
                    <td className="p-2 border">₹{book.price}</td>
                    <td className="p-2 border space-x-2">
                      <button onClick={() => handleEditBook(book)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDeleteBook(book.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'orders' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">User ID</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="p-2 border">{order.id}</td>
                    <td className="p-2 border">{order.userId}</td>
                    <td className="p-2 border">₹{order.total}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border space-x-2">
                      <select
                        value={order.status}
                        onChange={e => handleOrderStatusChange(order.id, e.target.value)}
                        disabled={orderStatusUpdating === order.id}
                        className="p-1 border rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab === 'users' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="p-2 border">UID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.uid}>
                    <td className="p-2 border">{user.uid}</td>
                    <td className="p-2 border">{user.displayName}</td>
                    <td className="p-2 border">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 