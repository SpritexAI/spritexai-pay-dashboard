// SpritEXAI Pay — dashboard routes.
// Mohammad Sijan (SpritexAI).

import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Gateways from './pages/Gateways'
import Customers from './pages/Customers'
import Transactions from './pages/Transactions'
import Invoices from './pages/Invoices'
import PaymentLinks from './pages/PaymentLinks'
import BrandSettings from './pages/BrandSettings'
import SmsData from './pages/SmsData'
import Devices from './pages/Devices'
import Addons from './pages/Addons'
import Domains from './pages/Domains'
import ApiKeys from './pages/ApiKeys'
import Staff from './pages/Staff'
import SystemSettings from './pages/SystemSettings'
import Activities from './pages/Activities'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/gateways" element={<Gateways />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payment-links" element={<PaymentLinks />} />
        <Route path="/brand-settings" element={<BrandSettings />} />
        <Route path="/sms-data" element={<SmsData />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/addons" element={<Addons />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/api-keys" element={<ApiKeys />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/system-settings" element={<SystemSettings />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
    </Layout>
  )
}
