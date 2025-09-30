import { Routes, Route } from "react-router";
import Layout from './Layout.jsx'

function Home() {
  return <>
    Home
  </>;
}

function Tasks() {
  return <>
    Tasks
  </>;
}

function Habits() {
  return <>
    Habits
  </>;
}

function Statistics() {
  return <>
    Statistics
  </>;
}

function Settings() {
  return <>
    Settings
  </>;
}

function Page404() {
  return <>
    Page404
  </>;
}

function About() {
  return <>
    About
  </>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="habits" element={<Habits />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="about" element={<About />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
