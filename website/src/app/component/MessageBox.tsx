import React from 'react'
import Messages from './Messages'

function MessageBox({messages}:{messages:{
    id: number;
    content: string;
    timestamp: Date;
    isUser: boolean;
}[]}) {
  return (
    <div className='flex flex-col gap-4  mx-auto  overflow-y-auto'>
        {
            messages.map((_,i)=>{
                return <Messages key={i} message={_.content} isUser={_.isUser}/>
            })
        }
    </div>
  )
}

export default MessageBox