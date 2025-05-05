import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import EditQuizPage from './pages/EditQuizPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      {/* <Route path="/signup" element={<SignUp />} /> */}
      <Route path="/teacher" element={<TeacherPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/edit-quiz/:quizId" element={<EditQuizPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;