'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Send, Users, MessageCircle, Loader2, ArrowLeft, Paperclip, X, Download, FileText, Image as ImageIcon, Video, Music, Menu } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { parseCookies } from 'nookies';
import { v4 as uuidv4 } from 'uuid';
import endPoints from '@/utils/endpoints.class';

interface User {
  id: string;
  first_name: string;
  surname: string;
  school_email: string;
  level: string;
  online: boolean;
}

interface FileAttachment {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
}

interface Message {
  id: string;
  text: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  file_attachment?: FileAttachment;
  sender?: User;
  isPending?: boolean;
}

interface Chat {
  id: string;
  user: User;
  last_message?: Message;
}

export default function SimpleChat() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<'chats' | 'users'>('users');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { darkMode } = useDarkMode();

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        let userId = null;
        let userEmail = null;
        let userMetadata = null;

        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          userId = user.id;
          userEmail = user.email;
          userMetadata = user.user_metadata;
        } else {
          const cookies = parseCookies();
          const userInfo = cookies['user-info'] ? JSON.parse(cookies['user-info']) : null;
          userId = userInfo?.supabase_user_id;
          userEmail = userInfo?.email;
          userMetadata = userInfo?.user_metadata;
        }

        if (!userId) {
          setLoading(false);
          return;
        }

        let { data: profile }:any = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!profile) {
  const { data: newProfile } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      first_name: userMetadata?.first_name || 'User',
      surname: userMetadata?.surname || '',
      school_email: userEmail || '',
      level: userMetadata?.level || '100',
      user_type: 'student',
      online: true,
      mongo_user_id: userId // Add this required field
    })
    .select()
    .single();
  
  profile = newProfile;
}

        if (profile) {
          setCurrentUser(profile);
          await supabase
            .from('profiles')
            .update({ online: true, last_seen: new Date().toISOString() })
            .eq('id', userId);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  // Load all users
  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      const { data }:any = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'student')
        .neq('id', currentUser.id);
      
      setUsers(data || []);
    };

    loadUsers();
  }, [currentUser]);

  // Load user's chats
  useEffect(() => {
    if (!currentUser) return;

    const loadChats = async () => {
      const { data: userMessages } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (!userMessages) return;

      const chatMap = new Map<string, Chat>();
      
      userMessages.forEach((message: any) => {
        const partnerId = message.sender_id === currentUser.id 
          ? message.receiver_id 
          : message.sender_id;
        
        const partner = message.sender_id === currentUser.id 
          ? message.receiver 
          : message.sender;

        if (!chatMap.has(partnerId)) {
          chatMap.set(partnerId, {
            id: partnerId,
            user: partner,
            last_message: message
          });
        }
      });

      setChats(Array.from(chatMap.values()));
    };

    loadChats();
  }, [currentUser]);

  // Load messages for selected chat
  useEffect(() => {
    if (!currentUser || !selectedChat) return;

    const loadMessages = async () => {
      const { data }:any = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedChat.id}),and(sender_id.eq.${selectedChat.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    };

    loadMessages();
  }, [currentUser, selectedChat]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!currentUser) return;

    const subscription = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          if (newMessage.sender_id !== currentUser.id && newMessage.receiver_id !== currentUser.id) {
            return;
          }

          // Create notification for incoming message
          if (newMessage.receiver_id === currentUser.id) {
            try {
              const { data: sender } = await supabase
                .from('profiles')
                .select('first_name, surname')
                .eq('id', newMessage.sender_id)
                .single();

              await endPoints.createNotification({
                userId: currentUser.id,
                type: 'message',
                title: `New Chat Message from ${sender?.first_name} ${sender?.surname}`,
                content: newMessage.file_attachment
                  ? `Sent a file: ${newMessage.file_attachment.file_name}`
                  : newMessage.text || 'New message received',
              });
            } catch (error) {
              console.error('Error creating notification:', error);
            }
          }
          
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newMessage.sender_id)
            .single();

          const messageWithSender = { ...newMessage, sender };

          if (selectedChat && 
              ((newMessage.sender_id === selectedChat.id && newMessage.receiver_id === currentUser.id) ||
               (newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedChat.id))) {
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMessage.id)) return prev;
              return [...prev, messageWithSender];
            });
          }

          setChats(prev => {
            const partnerId = newMessage.sender_id === currentUser.id 
              ? newMessage.receiver_id 
              : newMessage.sender_id;
            
            const existingChatIndex = prev.findIndex(chat => chat.id === partnerId);
            
            if (existingChatIndex >= 0) {
              const updatedChats:any= [...prev];
              updatedChats[existingChatIndex].last_message = messageWithSender;
              const updatedChat = updatedChats.splice(existingChatIndex, 1)[0];
              return [updatedChat, ...updatedChats];
            } else {
              const partner = newMessage.sender_id === currentUser.id 
                ? users.find(u => u.id === newMessage.receiver_id)
                : users.find(u => u.id === newMessage.sender_id);
              
              if (partner) {
                return [{
                  id: partnerId,
                  user: partner,
                  last_message: messageWithSender
                }, ...prev];
              }
              return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser, selectedChat, users]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close sidebar when a chat is selected on mobile
  useEffect(() => {
    if (selectedChat && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [selectedChat]);

  // File upload function
  const uploadFile = async (file: File): Promise<FileAttachment | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `chat-files/${currentUser!.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      return {
        id: fileName,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: publicUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  // Send message with optimistic update
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedChat || (!newMessage.trim() && !selectedFile) || sending) return;

    setSending(true);
    setUploading(!!selectedFile);

    const tempId = uuidv4();
    const optimisticMessage: Message = {
      id: tempId,
      text: newMessage.trim() || (selectedFile ? `Sent a file: ${selectedFile.name}` : ''),
      sender_id: currentUser.id,
      receiver_id: selectedChat.id,
      created_at: new Date().toISOString(),
      sender: currentUser,
      isPending: true
    };

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      optimisticMessage.file_attachment = {
        id: tempId,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        file_url: URL.createObjectURL(selectedFile)
      };
    }

    setMessages(prev => [...prev, optimisticMessage]);
    setChats(prev => {
      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex(chat => chat.id === selectedChat.id);
      if (chatIndex >= 0) {
        updatedChats[chatIndex].last_message = optimisticMessage;
        const updatedChat = updatedChats.splice(chatIndex, 1)[0];
        return [updatedChat, ...updatedChats];
      }
      return prev;
    });

    setNewMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      let fileAttachment: FileAttachment | null = null;
      
      if (selectedFile) {
        fileAttachment = await uploadFile(selectedFile);
        if (!fileAttachment) {
          throw new Error('Failed to upload file');
        }
      }

 const { data, error } = await supabase
  .from('messages')
  .insert({
    text: optimisticMessage.text,
    sender_id: currentUser.id,
    receiver_id: selectedChat.id,
    file_attachment: fileAttachment ? JSON.parse(JSON.stringify(fileAttachment)) : null
  })
  .select()
  .single();

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === tempId 
          ? { ...data, sender: currentUser, isPending: false }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      alert('Failed to send message');
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  // Start chat with user
  const startChat = (user: User) => {
    setSelectedChat({ id: user.id, user });
    setView('chats');
    setMessages([]);
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Users className="w-16 h-16 mb-4 text-gray-400" />
        <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to use chat</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF]"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full h-screen flex ${darkMode ? 'bg-[#0A1218]' : 'bg-white'} transition-colors duration-200`}>
      {/* Mobile menu button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#2563EB] text-white shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`w-80 border-r ${darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'} 
        fixed md:relative h-full z-40 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className={`p-4 border-b ${darkMode ? 'border-[#2A3744]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold">
              {currentUser.first_name[0]}{currentUser.surname[0]}
            </div>
            <div>
              <h2 className="font-semibold">{currentUser.first_name} {currentUser.surname}</h2>
              <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                Level {currentUser.level}
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden ml-auto p-1 rounded hover:bg-[#2A3744] dark:hover:bg-[#2A3744]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setView('users')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                view === 'users'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-[#1E2A38] text-[#A0B3C6] hover:bg-[#2A3744]'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setView('chats')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                view === 'chats'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-[#1E2A38] text-[#A0B3C6] hover:bg-[#2A3744]'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {view === 'users' ? (
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">All Users</h3>
              {users.map(user => (
                <div
                  key={user.id}
                  onClick={() => startChat(user)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    darkMode ? 'hover:bg-[#2A3744]' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium">
                        {user.first_name[0]}{user.surname[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${
                        user.online ? 'bg-green-500' : 'bg-gray-400'
                      } ${darkMode ? 'border-[#1E2A38]' : 'border-white'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{user.first_name} {user.surname}</p>
                      <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                        Level {user.level}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">Your Chats</h3>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? 'bg-[#2563EB] text-white'
                      : darkMode
                      ? 'hover:bg-[#2A3744]'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium">
                      {chat.user.first_name[0]}{chat.user.surname[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{chat.user.first_name} {chat.user.surname}</p>
                      {chat.last_message && (
                        <p className={`text-sm truncate ${
                          selectedChat?.id === chat.id ? 'text-blue-100' : darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'
                        }`}>
                          {chat.last_message.file_attachment ? (
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              {chat.last_message.file_attachment.file_name}
                            </span>
                          ) : (
                            chat.last_message.text
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col w-full">
        {selectedChat ? (
          <>
            <div className={`p-4 border-b flex items-center gap-3 ${
              darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'
            }`}>
              <button
                onClick={() => {
                  setSelectedChat(null);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(true);
                  }
                }}
                className="p-2 rounded-lg hover:bg-[#2A3744] dark:hover:bg-[#2A3744]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium">
                {selectedChat.user.first_name[0]}{selectedChat.user.surname[0]}
              </div>
              <div>
                <h1 className="font-semibold">{selectedChat.user.first_name} {selectedChat.user.surname}</h1>
                <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                  Level {selectedChat.user.level}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === currentUser.id
                        ? `bg-[#2563EB] text-white ${message.isPending ? 'opacity-75' : ''}`
                        : darkMode
                        ? 'bg-[#1E2A38] text-[#E2E8F0]'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.text && <p className="mb-2 break-words">{message.text}</p>}
                    
                    {message.file_attachment && (
                      <div className={`p-2 rounded border ${
                        message.sender_id === currentUser.id
                          ? 'border-[#1E40AF] bg-[#3B82F6]'
                          : darkMode
                          ? 'border-[#2A3744] bg-[#2A3744]'
                          : 'border-gray-300 bg-gray-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {getFileIcon(message.file_attachment.file_type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {message.file_attachment.file_name}
                            </p>
                            <p className="text-xs opacity-75">
                              {formatFileSize(message.file_attachment.file_size)}
                            </p>
                          </div>
                        </div>
                        
                        {message.file_attachment.file_type.startsWith('image/') && (
                          <img 
                            src={message.file_attachment.file_url} 
                            alt={message.file_attachment.file_name}
                            className="max-w-full h-auto rounded mb-2"
                          />
                        )}
                        
                        <a
                          href={message.file_attachment.file_url}
                          download={message.file_attachment.file_name}
                          className="flex items-center gap-1 text-xs underline"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    )}
                    
                    <p className={`text-xs mt-1 ${
                      message.sender_id === currentUser.id
                        ? 'text-blue-100'
                        : darkMode
                        ? 'text-[#A0B3C6]'
                        : 'text-gray-500'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {message.isPending && ' (Sending...)'}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {selectedFile && (
              <div className={`p-4 border-t ${
                darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`p-3 rounded-lg border ${
                  darkMode ? 'border-[#2A3744] bg-[#1E2A38]' : 'border-gray-300 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile.type)}
                    <div className="flex-1">
                      <p className="font-medium truncate">{selectedFile.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1 rounded hover:bg-[#2A3744] dark:hover:bg-[#2A3744]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={sendMessage} className={`p-4 border-t ${
              darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg hover:bg-[#2A3744] dark:hover:bg-[#2A3744]"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-[#1E2A38] border-[#2A3744] text-[#E2E8F0] placeholder-[#A0B3C6]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:border-[#2563EB]`}
                  aria-label="Type a message"
                />
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !selectedFile) || sending}
                  className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                    darkMode
                      ? 'bg-[#4B91F1] hover:bg-[#3B82F6]'
                      : 'bg-[#2563EB] hover:bg-[#1E40AF]'
                  } disabled:opacity-50`}
                  aria-label="Send message"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Uploading...</span>
                    </>
                  ) : sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Select a Chat</h2>
            <p className={`${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'} mb-6`}>
              Choose a conversation or start a new one
            </p>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF]"
            >
              Open Chats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}