import { useState } from 'react'
import './App.scss'
import { Grid } from './features/grid/grid'
import { View } from './features/view/view'
import { Upload } from './features/upload/upload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Grid />
      <View />
      <Upload />
    </div>
  )
}

export default App
