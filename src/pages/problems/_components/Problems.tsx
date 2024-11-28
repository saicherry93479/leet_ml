import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Youtube, Crown, ChevronUp, ChevronDown } from 'lucide-react';

const ProblemsList = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const difficultyColors = {
    Hard: 'text-red-500 bg-red-50',
    Medium: 'text-orange-500 bg-orange-50',
    Easy: 'text-green-500 bg-green-50'
  };

  // Fetch problems data
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('/api/problems');
        setProblems(response.data || []);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Sort and filter problems
  const getSortedAndFilteredProblems = () => {
    let filteredProblems = [...problems];

    // Apply search filter
    if (searchQuery) {
      filteredProblems = filteredProblems.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      filteredProblems = filteredProblems.filter(problem =>
        problem.difficulty === selectedDifficulty
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filteredProblems = filteredProblems.filter(problem =>
        problem.category === selectedCategory
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredProblems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredProblems;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleProblemClick = (problemId, premium) => {
    if (user?.premiumUser) {
      window.location.href = `/problems/${problemId}`;
    } else {
      if (premium) {
        window.location.href = "/payment";
      } else {
        window.location.href = `/problems/${problemId}`;
      }
    }
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(problems.map(problem => problem.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredProblems = getSortedAndFilteredProblems();

  return (
    <div className="p-4 md:p-8 max-w-[80rem] lg:min-w-[60rem] 2xl:min-w-[80rem] mx-auto">
      {/* Search and Filters Section */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-2 hover:text-purple-600"
                  >
                    Problem Title
                    {sortConfig.key === 'title' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Resources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProblemClick(problem.id, problem.isPremium)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {problem.title}
                      </button>
                      {problem.isPremium && (
                        <Crown className="text-yellow-500" size={16} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{problem.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {problem.videoSolution ? (
                        <a
                          href={problem.videoSolution}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Youtube size={20} />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No video</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredProblems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No problems found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProblemsList;