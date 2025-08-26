import React from 'react'


function Message({ message}:{
  message: any
}) {
  const isUserMessage = message?.senderId === JSON.parse(localStorage.getItem('user') as string)?._id
  return (
    <div className={`w-[50%] ${isUserMessage? "self-end" :"self-start"} rounded-md w-[max-content] p-4 text-[#fff] min-w-[30px] bg-[#1578f1] h-[max-content] `}>
        <p className='text-[12px]'>{message?.message}</p>
       <div className='flex w-full justify-end'>
       <p className='text-[10px]'>{message?.time}</p>
       </div>
    </div>
  )
}

export default Message