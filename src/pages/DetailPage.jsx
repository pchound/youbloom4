import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchUserById } from '../services/apiService';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserById(id);
        setUser(userData);
      } catch (err) {
        setError('Failed to load user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate('/main');
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="User Details" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-medium">Error</h3>
            <p>{error}</p>
            <button
              onClick={handleGoBack}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Go Back to Main Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="User Details" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">User not found</p>
            <button
              onClick={handleGoBack}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back to Main Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="User Details" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden fade-in">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="bg-white text-blue-600 w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-blue-100 text-lg">@{user.username}</p>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-blue-600 hover:text-blue-800">
                      <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                        {user.website}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Street</label>
                    <p className="text-gray-900">{user.address.street} {user.address.suite}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-gray-900">{user.address.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Zipcode</label>
                    <p className="text-gray-900">{user.address.zipcode}</p>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Company</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900 font-medium">{user.company.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Catchphrase</label>
                    <p className="text-gray-900 italic">"{user.company.catchPhrase}"</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business</label>
                    <p className="text-gray-900">{user.company.bs}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    User ID: <span className="font-medium">{user.id}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Coordinates: {user.address.geo.lat}, {user.address.geo.lng}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPage;