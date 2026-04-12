import React, { useEffect } from 'react'

export const PageTitle = ({title}) => {

    useEffect (() => {
        document.title = title
        })

  return (
   <></>
  )
}
