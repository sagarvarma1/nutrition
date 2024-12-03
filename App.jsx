import { AuthProvider } from './src/context/AuthContext';
import Login from './src/components/Auth/Login';
import Register from './src/components/Auth/Register';
import ProtectedRoute from './src/components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/tracker" element={
                            <ProtectedRoute>
                                <NutritionTracker />
                            </ProtectedRoute>
                        } />
                        <Route path="/meal-planner" element={
                            <ProtectedRoute>
                                <MealPlanner />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;