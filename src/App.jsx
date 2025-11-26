import { Routes, Route } from "react-router";
import Layout from './Layout.jsx'
import Home from './Home.jsx'
import { useState, useEffect } from 'react'
import useNeomeStore from './useNeomeStore.js'
import Tasks from './Tasks/Tasks.jsx'
import NewTask from './Tasks/NewTask.jsx'

function Habits() {
  return <>
    Habits TODO
  </>;
}

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

function Page404() {
  return <>
    Page404 TODO
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
        </Route>
        <Route path="habits" element={<Habits />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="about" element={<About />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
