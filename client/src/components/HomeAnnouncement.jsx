import Link from 'next/link'
import React from 'react'

function HomeAnnouncement() {
  return (
    <div className='p-3 bg-neutral-800 tracking-tight'>
        <h1 className='text-white text-center leading-6 text-xs md:text-sm font-normal'>Get Up to Get up to 6 months of No Cost EMI plus up to ₹100 instant cashback on selected products with eligible cards.<br/> <Link className='text-blue-400 text-xs' href={'/store'}>Shop<i className="text-sm fa-solid fa-chevron-right"></i></Link></h1>
    </div>
  )
}

export default HomeAnnouncement