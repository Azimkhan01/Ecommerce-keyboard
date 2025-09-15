import { configureStore }  from "@reduxjs/toolkit";
// import themeReducer from './Theme/ThemeSlicer'
import AuthReducer from './Auth/AuthSlicer'
const Store = configureStore({
    reducer:{
        // theme:themeReducer,
        Auth:AuthReducer
    }
})

export default Store