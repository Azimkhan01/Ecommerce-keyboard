'use client'

import Store from "@/Store/Store"
import { Provider } from "react-redux"

function ReduxProvider({children}) {
  return (
    <Provider store={Store}>{children}</Provider>
  )
}

export default ReduxProvider