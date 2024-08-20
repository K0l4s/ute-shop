import React from 'react'
import { Route, Routes } from 'react-router-dom'

type Props = {}

const Router = (props: Props) => {
  return (
    <>
    <Routes>
      <Route path="/" element={<div>Home</div>} />
    </Routes>
    </>
  )
}

export default Router