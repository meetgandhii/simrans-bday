import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const generateUsername = (name) => {
    if (name.toLowerCase().includes('simran')) {
      return 'sallu bhai ki jeejeeboi';
    }
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const randomNum = Math.floor(Math.random() * 1000);
    return cleanName ? `${cleanName}${randomNum}` : `player${randomNum}`;
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    const generatedUsername = generateUsername(name.trim());
    const isAdmin = name.toLowerCase() === 'admin' && password === 'admin123';
    
    const userData = {
      name: name.trim(),
      email: email.trim(),
      username: generatedUsername,
      isAdmin,
      loginTime: new Date().toISOString()
    };
    
    onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏎️</div>
          <h1 className="text-2xl font-bold text-f1-red mb-2">Birthday Treasure Hunt</h1>
          <p className="text-gray-600">Simran's Racing Adventure</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-f1-red"
              placeholder="Enter your full name"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-f1-red"
              placeholder="Enter your email"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-f1-red"
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            onClick={handleSubmit}
            className="w-full bg-f1-red text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
          >
            Start Hunt
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Username will be generated automatically
          </p>
          {/* <p className="text-sm text-gray-500 mt-1">
            Admin: name "admin", password "admin123"
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;