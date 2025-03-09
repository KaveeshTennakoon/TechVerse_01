import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Ticket as Cricket, Trophy, Users, Calendar } from 'lucide-react';

interface Activity {
  title: string;
  time: string;
  type: string;
}

interface DashboardData {
  recentMatches: number;
  teamMembers: number;
  upcomingEvents: number;
  recentActivity: Activity[];
}

function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    recentMatches: 0,
    teamMembers: 0,
    upcomingEvents: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const userJson = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userJson || !token) {
          // Not logged in, redirect to login page
          navigate('/');
          return;
        }

        // Parse user data
        const userData = JSON.parse(userJson);
        setUsername(userData.username);
        
        // Fetch dashboard data
        try {
          const dashboardResponse = await fetch('http://localhost:5000/api/dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include',
          });
          
          if (dashboardResponse.ok) {
            const data = await dashboardResponse.json();
            setDashboardData(data);
          } else if (dashboardResponse.status === 401) {
            // Unauthorized - token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
            return;
          } else {
            throw new Error(`Failed to fetch dashboard data: ${dashboardResponse.status}`);
          }
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          setError('Failed to load dashboard data. Using default data instead.');
          
          // Use default data if API fails
          setDashboardData({
            recentMatches: 24,
            teamMembers: 16,
            upcomingEvents: 3,
            recentActivity: [
              { title: "Team Practice", time: "2 hours ago", type: "practice" },
              { title: "Match vs Eagles", time: "Yesterday", type: "match" },
              { title: "Strategy Meeting", time: "2 days ago", type: "meeting" },
            ]
          });
        }
      } catch (err) {
        console.error('Error in auth check:', err);
        setError('Authentication error. Please log in again.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Matches</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.recentMatches}</p>
            <p className="text-sm text-gray-500">Matches this season</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.teamMembers}</p>
            <p className="text-sm text-gray-500">Active players</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-8 h-8 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">{dashboardData.upcomingEvents}</p>
            <p className="text-sm text-gray-500">Scheduled matches</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="divide-y divide-gray-100">
              {dashboardData.recentActivity.map((activity, index) => (
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