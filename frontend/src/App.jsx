import React from "react";
import { Route, Routes } from "react-router";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import toast from "react-hot-toast";

const App = () => {
  return (
    <div data-theme='dark'>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/notes' element={<HomePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/note/:id' element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
