import { useState } from "react"



export const Upload = () => {
  const [uploadState, setUploadState] = useState('Upload')
  
  const startUpload = () => {
    setUploadState('Uploading...')
    setTimeout(() => {
      setUploadState('Upload')
    }, 3000)
  } 

  return (
    <>
      <button onClick={() => startUpload()}>{uploadState}</button>
    </>
  )
}