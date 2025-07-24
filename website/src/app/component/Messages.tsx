import React from 'react';

function Messages({ message, isUser }: { message: string; isUser: boolean }) {
  return (
    <div className={`flex gap-1 ${isUser ? "self-end" : "self-start"}` }>
     {/* {!isUser && <img src="/ligthLogo.svg" className='w-[20px]'/>} */}
      <div className={`flex  text-[16px] flex-col gap-4  px-3 py-2 rounded-xl ${isUser  ? " bg-[#ffffff] text-[#0a0a0a]" : " bg-[#0a0a0a] text-[#fff] w-[250px]"}`}>
     {message}
    </div>
    </div>
    
  );
}

export default Messages;
