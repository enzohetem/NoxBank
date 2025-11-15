import { ReactNode } from 'react'
import { ToastContainer, toast } from 'react-toastify'

interface layoutProps {
  children: ReactNode
}

export default function layout({ children }: layoutProps) {
  return (
    <div>
      <ToastContainer />
      {children}
    </div>
  )
}
