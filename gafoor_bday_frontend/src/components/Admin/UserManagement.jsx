import React, { useState, useEffect } from 'react';
import { Users, Trophy, Star, SkipForward, Eye } from 'lucide-react';
import { formatPoints, formatDate } from '../../utils/helpers';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Mock data - in a real app, this would come from an admin API
      const mockUsers = [
        {
          id: '1',
          name: 'Simran',
          username: 'jeejeegirl',
          email: 'simran@example.com',
          role: 'player',
          totalScore: 850,
          availablePoints: 200,
          gameProgress: {
            currentClue: 4,
            completedClues: [1, 2, 3],
            completedTasks: [1, 2]
          },
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'John Doe',
          username: 'shahrukhking123',
          email: 'john@example.com',
          role: 'player',
          totalScore: 650,
          availablePoints: 150,
          gameProgress: {
            currentClue: 3,
            completedClues: [1, 2],
            completedTasks: [1]
          },
          createdAt: new Date('2024-01-16')
        },
        {
          id: '3',
          name: 'Admin User',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          totalScore: 0,
          availablePoints: 0,
          gameProgress: {
            currentClue: 1,
            completedClues: [],
            completedTasks: []
          },
          createdAt: new Date('2024-01-10')
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipClue = async (userId, clueId) => {
    try {
      // This would call the admin API to skip a clue for a user
      console.log(`Skipping clue ${clueId} for user ${userId}`);
      alert(`Clue ${clueId} skipped for user`);
    } catch (error) {
      console.error('Error skipping clue:', error);
      alert('Failed to skip clue');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Users ({users.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Clue #{user.gameProgress.currentClue}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.gameProgress.completedClues.length}/7 completed
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPoints(user.availablePoints)} available
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPoints(user.totalScore)} total
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.role === 'player' && (
                        <button
                          onClick={() => handleSkipClue(user.id, user.gameProgress.currentClue)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Skip to next clue"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-sm text-gray-900">@{selectedUser.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Game Progress</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Clue:</span>
                      <span className="font-medium">#{selectedUser.gameProgress.currentClue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed Clues:</span>
                      <span className="font-medium">{selectedUser.gameProgress.completedClues.length}/7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bonus Tasks:</span>
                      <span className="font-medium">{selectedUser.gameProgress.completedTasks.length}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Points</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span className="font-medium text-red-600">{formatPoints(selectedUser.availablePoints)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Score:</span>
                      <span className="font-medium">{formatPoints(selectedUser.totalScore)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                {selectedUser.role === 'player' && (
                  <button
                    onClick={() => handleSkipClue(selectedUser.id, selectedUser.gameProgress.currentClue)}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Skip Clue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
