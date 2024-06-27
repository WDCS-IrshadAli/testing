'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
 
export default function Error({ error, reset }: {error: Error & { digest?: string }, reset: () => void }) {
  
  // useEffect Hook
  useEffect(() => {
    console.error(error);
  }, [error])
 
  return (
    <div className="p-3 sm:p-6 w-full flex justify-center items-center flex-col h-[75vh]">
        <div className='w-[75vh] text-center'>
        <h1 className="text-2xl mb-4">Something went wrong! ({error?.message})</h1>
        <Button onClick={() => reset()} variant="secondary">Try again</Button>
        </div>
    </div>
  )
}