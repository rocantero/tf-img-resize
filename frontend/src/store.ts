import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { imgViewSlice } from "./features/view/view.slice"
import { imgUploadSlice } from "./features/upload/upload.slice"
import { imgApiSlice } from "./features/grid/grid.slice"

const rootReducer = combineReducers({
  imgView: imgViewSlice.reducer,
  [imgApiSlice.reducerPath]: imgApiSlice.reducer,
})
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware: any) => {
      return getDefaultMiddleware().concat(imgApiSlice.middleware)
    },
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
