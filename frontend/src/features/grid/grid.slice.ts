// Need to use the React-specific entry point to import `createApi`
import { createApi, fetchBaseQuery, RootState } from "@reduxjs/toolkit/query/react"
import { createEntityAdapter, createSelector, EntityState } from "@reduxjs/toolkit"

interface Img {
  name: string
  url: string
}

interface ImgListApiResponse {
  results: Img[]
  count: number
}


export const imgApiSlice = createApi({
  // TODO read AWS lambda URL from env somehow
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.example.com" }),
  reducerPath: "images",
  
  tagTypes: ["img"],
  endpoints: build => ({
    getAllImages: build.query({
      query: () => "/images",
      transformResponse: (response: ImgListApiResponse) => {
        const { results } = response
        return results
      }
    }),
    getImage: build.query({
      query: ({ width, height, name }) => `/images/${width}x${height}/${name}`,
      providesTags(result, error, arg, meta) {
        return [{ type: "img", id: arg }]
      },
    })
  }),
})


export const { useGetAllImagesQuery, useGetImageQuery } = imgApiSlice
