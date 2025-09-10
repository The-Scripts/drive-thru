import { createRoot } from 'react-dom/client'
import './index.css'

import { RapierEngine } from './CoreComponents/RapierContext.jsx'
import { Enviroment } from './App.jsx'


createRoot(document.getElementById('root')).render(
  <RapierEngine>
    <Enviroment />
  </RapierEngine>
)
