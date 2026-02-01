import { useState } from 'react';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}

export default App;
