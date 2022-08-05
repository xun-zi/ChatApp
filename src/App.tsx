import { RouterView } from 'oh-router-react';
import React from 'react';
import { router } from './router';


function App() {
  return (
    <div className="App">
      <RouterView router={router}/>
    </div>
  );
}

export default App;
