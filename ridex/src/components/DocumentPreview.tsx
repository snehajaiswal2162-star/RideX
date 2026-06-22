import React from 'react'

const DocumentPreview = ({label,url}:any) => {
  const isImg = url?.match(/\.(jpg|jpeg|png|webp)$/i)
  const isPdf = url?.endsWith(".pdf")
  return (
    <div className='bg-gray-50 rounded-2xl border overflow-hidden shadow-sm'>
      <div className="px-5 py-3 font-semibold text-sm border-b">
        {label}
        </div> 

        <div className='h-54 flex items-center justify-center bg-white'>
          {!url && <span className='text-gray-400 text-sm'>Image Not Uploaded</span>}
          {isImg && <img src={url} className='w-full h-full object-cover'/>}
          {isPdf && <iframe src={url} className="w-full h-full" />}
          </div> 

          {url && 
          <a
          href={url}
          target='_blank'
          className='block text-center text-sm py-2 font-medium hover:bg-gray-300'
          >Open Document</a>
          }
    </div>
  )
}

export default DocumentPreview
