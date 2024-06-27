import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { getAllLinks } from './lib/action'

const Home = async () => {
  let linksData: any = await getAllLinks();  
  return (
    <div className="container mx-auto p-5">
      
      <h2 className="text-3xl font-semibold italic">Home Page</h2>
      <div className="ps-5 mt-3 flex gap-3">
        {
          linksData?.data?.map((curElem: any, index: number) => {
            return (
              <p key={index}><Button><Link href={`/pages/${curElem?.key}`}>{curElem?.name}</Link></Button></p>
            )
          })
        }
        <p><Button><Link href={`/pages/modules`}>modules</Link></Button></p>
      </div>
    </div>
  )
}

export default Home