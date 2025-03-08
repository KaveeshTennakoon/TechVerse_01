import { LogOut, Ticket as Cricket, Trophy, Users, Calendar } from 'lucide-react';

interface LandingPageProps {
  username: string;
  onLogout: () => void;
}

function LandingPage({ username, onLogout }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cricket className="w-8 h-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CricketPro</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hello, {username}!</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Matches</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">Matches this season</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">16</p>
            <p className="text-sm text-gray-500">Active players</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-8 h-8 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">Scheduled matches</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {[
                { title: 'Team Practice', time: '2 hours ago', type: 'practice' },
                { title: 'Match vs Eagles', time: 'Yesterday', type: 'match' },
                { title: 'Strategy Meeting', time: '2 days ago', type: 'meeting' },
              ].map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'match' ? 'bg-green-100 text-green-800' :
                      activity.type === 'practice' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;