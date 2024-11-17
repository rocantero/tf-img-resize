import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Img { 
  name: string
  url: string
}

export const imgViewSlice = createSlice({
  name: 'imgView',
  initialState: {
    img: null,
  } as { img: Img | null },
  reducers: create => ({
    setImg: create.reducer((state, action: PayloadAction<Img>) => {
      state.img = action.payload
    }),
    clearImg: create.reducer((state) => {
      state.img = null
    })
  }),
})

export const selectImg = (state: { img: Img | null }) => state.img
export const { setImg, clearImg } = imgViewSlice.actions
export default imgViewSlice.reducer