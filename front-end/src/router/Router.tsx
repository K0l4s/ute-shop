import React from 'react'
import { Route, Routes } from 'react-router-dom'

type Props = {}

const Router = (props: Props) => {
  return (
    <>
    <Routes>
      <Route path="/" element={<h1 className='text-3xl font-bold underline'>Home</h1>} />
    </Routes>
    </>
  )
}

export default Router