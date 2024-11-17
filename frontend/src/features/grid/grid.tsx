import { useState, useEffect, Key } from "react"
import { useGetAllImagesQuery } from "./grid.slice"
import { useAppSelector } from "../../hooks"
import './grid.scss'

interface ImgResponse {
  name: string
  link: string
}

export const Grid = () => {
  const [images, setImages] = useState<Img>([])
  const [count, setCount] = useState(0)

  const { data, isError, isLoading, isSuccess } =
    useGetAllImagesQuery({})

  useEffect(() => {
    const count = data ? data.length : 0;
    setCount(count)
    const images = data || []
    setImages(images)
  }, [data])

  return (
    <div className='grid__container'>
      <div className='grid__heading'>
        <h2>Showing {count} images</h2>
      </div>
      <div className="grid__images">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error fetching images</div>}
        {isSuccess &&
          images.map((img: ImgResponse) => (
            <div key={img.name} className='grid__image'>
              <img src={img.link} alt={img.name} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

  