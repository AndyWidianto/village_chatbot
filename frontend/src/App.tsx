import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Broadcast from './pages/broadcasts/Broadcast'
import AutoReply from './pages/autoreplies/AutoReply'
import Device from './pages/Device'
import { ThemeProvider } from './ThemeProvider'
import CreateAutoReply from './pages/autoreplies/CreateAutoreply'
import ProfileSettings from './pages/Settings'
import Notification from './pages/Notification'
import CreateBroadcast from './pages/broadcasts/CreateBroadcast'


export default function App() {
  return (
    // Letakkan di sini agar seluruh aplikasi punya akses ke tema yang sama
    <ThemeProvider> 
      <BrowserRouter>
        <Routes>
          {/* Dashboard Group */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="autoreply" element={<AutoReply />} />
            <Route path="autoreply/create" element={<CreateAutoReply />} />
            <Route path="broadcasts" element={<Broadcast />} />
            <Route path="broadcasts/create" element={<CreateBroadcast />} />
            <Route path="devices" element={<Device />} />
            <Route path="tasks" element={<Dashboard />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="notifications" element={<Notification />} />
          </Route>

          {/* Test Page */}
          <Route path="/test" element={<h2>Hallo</h2>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}