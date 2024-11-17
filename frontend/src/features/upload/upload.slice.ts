
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query"
import { imgViewSlice } from "../view/view.slice"
import { createSlice } from "@reduxjs/toolkit"

interface Img { 
  name: string
  url: string
}

export const imgUploadApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "API_URL" }),
  reducerPath: "images",
  tagTypes: ["Images"],
  endpoints: build => ({
    uploadImage: build.mutation({
      query: (file: File) => ({
        url: "/images",
        method: "POST",
        body: file,
      }),
      transformResponse: (response: Img) => {
        const data = response
        dispatchEvent(imgUploadSlice.actions.addImgToList(data))
      },
    })
  }),
})

export const imgUploadSlice = createSlice({
  name: "images",
  initialState: {
    images: [] as Img[],
  },
  reducers: {
    addImgToList: ((state, action: PayloadAction<Img>) => {
      state.images.push(action.payload)
    }),
  },
})
export const { uploadImage } = imgUploadApiSlice.endpoints
export const { addImgToList } = imgUploadSlice.actions