import { Routes, Route } from "react-router";
import Layout from './Layout'
import Home from './Home'
import { useState, useEffect } from 'react'
import Tasks from './Tasks/Tasks'
import NewTask from './Tasks/NewTask'
import OpenTask from './Tasks/OpenTask'
import CompletedTask from './Tasks/Completed'
import Page404 from './Page404'
import Habits from './Habits/Habits'
import NewHabit from './Habits/NewHabit'

function Statistics() {
  return <>
    Statistics TODO
  </>;
}

function Settings() {
  return <>
    Settings TODO
  </>;
}

function About() {
  return <>
    About TODO
  </>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tasks">
          <Route index element={<Tasks />} />
          <Route path="new" element={<NewTask />} />
          <Route path="completed" element={<CompletedTask />}/>
          <Route path=":taskId" element={<OpenTask />}/>
        </Route>
        <Route path="habits">
          <Route index element={<Habits />} />
          <Route path="new" element={<NewHabit />} />
          {/* <Route path=":habitId" element={<OpenHabit />}/> */}
        </Route>
        <Route path="statistics" element={<Statistics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="about" element={<About />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
