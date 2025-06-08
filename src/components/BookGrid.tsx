import React, { useState, useMemo } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  searchTerm: string;
}

const BookGrid: React.FC<BookGridProps> = ({ books, searchTerm }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'author'>('title');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map(book => book.category)));
    return ['all', ...cats];
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    const filtered = books.filter(book => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'author':
          return a.author.localeCompare(b.author);
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [books, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Books' : category}
            </button>
          ))}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'title' | 'price' | 'author')}
          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm w-full sm:w-auto"
        >
          <option value="title">Sort by Title</option>
          <option value="price">Sort by Price</option>
          <option value="author">Sort by Author</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600 text-xs sm:text-base">
          Showing {filteredAndSortedBooks.length} of {books.length} books
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Books Grid */}
      {filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default BookGrid;