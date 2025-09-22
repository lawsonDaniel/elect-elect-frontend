'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Send, Users, MessageCircle, Loader2, ArrowLeft, Paperclip, X, Download, FileText, Image as ImageIcon, Video, Music, Menu, Plus } from 'lucide-react';
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
  user_type: string;
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
  receiver_id?: string;
  group_id?: string;
  created_at: string;
  file_attachment?: FileAttachment;
  sender?: User;
  isPending?: boolean;
}

interface Chat {
  id: string;
  user?: User;
  group?: Group;
  last_message?: Message;
}

interface Group {
  id: string;
  name: string;
  creator_id: string;
  members: string[];
  created_at: string;
}

export default function SimpleChat() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<'chats' | 'users' | 'groups'>('users');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

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

        let { data: profile }: any = await supabase
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
              user_type: userMetadata?.user_type || 'student',
              online: true,
              mongo_user_id: userId
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
      const { data }: any = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser.id);
      
      setUsers(data || []);
    };

    loadUsers();
  }, [currentUser]);

  // Load user's chats and groups
  useEffect(() => {
    if (!currentUser) return;

    const loadChatsAndGroups = async () => {
      // Load individual chats
      const { data: userMessages } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .is('group_id', null)
        .order('created_at', { ascending: false });

      const chatMap = new Map<string, Chat>();
      
      if (userMessages) {
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
      }

      // Load groups
      const { data: groupData } = await supabase
        .from('groups')
        .select(`
          *,
          messages (
            *,
            sender:profiles!messages_sender_id_fkey(*)
          )
        `)
        .contains('members', [currentUser.id]);

      if (groupData) {
        groupData.forEach((group: any) => {
          const lastMessage = group.messages?.length > 0 
            ? group.messages[group.messages.length - 1]
            : undefined;
          
          chatMap.set(group.id, {
            id: group.id,
            group: {
              id: group.id,
              name: group.name,
              creator_id: group.creator_id,
              members: group.members,
              created_at: group.created_at
            },
            last_message: lastMessage
          });
        });
      }

      setChats(Array.from(chatMap.values()));
      setGroups(groupData || []);
    };

    loadChatsAndGroups();
  }, [currentUser]);

  // Load messages for selected chat or group
  useEffect(() => {
    if (!currentUser || !selectedChat) return;

    const loadMessages = async () => {
      let query = supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*)
        `)
        .order('created_at', { ascending: true });

      if (selectedChat.group) {
        query = query.eq('group_id', selectedChat.id);
      } else {
        query = query.or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedChat.id}),and(sender_id.eq.${selectedChat.id},receiver_id.eq.${currentUser.id})`);
      }

      const { data }: any = await query;

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
          
          // Handle group messages
          if (newMessage.group_id) {
            const isGroupMember = groups.some(group => 
              group.id === newMessage.group_id && group.members.includes(currentUser.id)
            );
            if (!isGroupMember) return;
          } else if (newMessage.sender_id !== currentUser.id && newMessage.receiver_id !== currentUser.id) {
            return;
          }

          // Create notification for incoming message
          if (newMessage.receiver_id === currentUser.id || newMessage.group_id) {
            try {
              const { data: sender } = await supabase
                .from('profiles')
                .select('first_name, surname')
                .eq('id', newMessage.sender_id)
                .single();

              const title = newMessage.group_id 
                ? `New Group Message in ${groups.find(g => g.id === newMessage.group_id)?.name || 'Group'}`
                : `New Chat Message from ${sender?.first_name} ${sender?.surname}`;

              await endPoints.createNotification({
                userId: currentUser.id,
                type: 'message',
                title,
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
              ((newMessage.group_id && newMessage.group_id === selectedChat.id) ||
               (!newMessage.group_id && 
                ((newMessage.sender_id === selectedChat.id && newMessage.receiver_id === currentUser.id) ||
                 (newMessage.sender_id === currentUser.id && newMessage.receiver_id === selectedChat.id))))) {
            setMessages(prev => {
              if (prev.some(msg => msg.id === newMessage.id)) return prev;
              return [...prev, messageWithSender];
            });
          }

          setChats(prev => {
            const partnerId = newMessage.group_id || 
              (newMessage.sender_id === currentUser.id 
                ? newMessage.receiver_id 
                : newMessage.sender_id);
            
            const existingChatIndex = prev.findIndex(chat => chat.id === partnerId);
            
            if (existingChatIndex >= 0) {
              const updatedChats: any = [...prev];
              updatedChats[existingChatIndex].last_message = messageWithSender;
              const updatedChat = updatedChats.splice(existingChatIndex, 1)[0];
              return [updatedChat, ...updatedChats];
            } else {
              if (newMessage.group_id) {
                const group = groups.find(g => g.id === newMessage.group_id);
                if (group) {
                  return [{
                    id: newMessage.group_id,
                    group,
                    last_message: messageWithSender
                  }, ...prev];
                }
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
  }, [currentUser, selectedChat, users, groups]);

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

    // Validate inputs
    if (!currentUser || !selectedChat || (!newMessage.trim() && !selectedFile) || sending) {
      console.error('Invalid input:', { currentUser, selectedChat, newMessage, selectedFile, sending });
      return;
    }

    // Validate chat type and ID
    if (!selectedChat.user && !selectedChat.group) {
      console.error('Invalid chat type: Must be user or group chat', selectedChat);
      alert('Cannot send message: Invalid chat type');
      return;
    }
    if (selectedChat.user && !selectedChat.id) {
      console.error('Invalid receiver_id for user chat', selectedChat);
      alert('Cannot send message: Invalid recipient');
      return;
    }
    if (selectedChat.group && !selectedChat.id) {
      console.error('Invalid group_id for group chat', selectedChat);
      alert('Cannot send message: Invalid group');
      return;
    }

    setSending(true);
    setUploading(!!selectedFile);

    const tempId = uuidv4();
    const optimisticMessage: Message = {
      id: tempId,
      text: newMessage.trim() || (selectedFile ? `Sent a file: ${selectedFile.name}` : ''),
      sender_id: currentUser.id,
      receiver_id: selectedChat.user ? selectedChat.id : undefined,
      group_id: selectedChat.group ? selectedChat.id : undefined,
      created_at: new Date().toISOString(),
      sender: currentUser,
      isPending: true,
    };

    if (selectedFile) {
      optimisticMessage.file_attachment = {
        id: tempId,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        file_url: URL.createObjectURL(selectedFile),
      };
    }

    // Optimistic UI updates
    setMessages((prev: Message[]) => [...prev, optimisticMessage]);
    setChats((prev: Chat[]) => {
      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex((chat) => chat.id === selectedChat.id);
      if (chatIndex >= 0) {
        updatedChats[chatIndex].last_message = optimisticMessage;
        const updatedChat = updatedChats.splice(chatIndex, 1)[0];
        return [updatedChat, ...updatedChats];
      }
      return prev;
    });

    // Reset input fields
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

      // Debug: Log selectedChat to verify its structure
      console.log('Selected chat:', {
        selectedChatId: selectedChat.id,
        hasUser: !!selectedChat.user,
        hasGroup: !!selectedChat.group,
        receiverId: selectedChat.user ? selectedChat.id : null,
        groupId: selectedChat.group ? selectedChat.id : null,
      });

      // Prepare message data based on chat type
      const messageData: Partial<Message> = {
        text: optimisticMessage.text,
        sender_id: currentUser.id,
        file_attachment: fileAttachment || null,
        receiver_id: selectedChat.user ? selectedChat.id : null,
        group_id: selectedChat.group ? selectedChat.id : null,
      };

      console.log('Inserting message:', messageData); // Debug log

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23502') {
          console.error('Not-null constraint violation. Message data:', messageData);
          alert('Cannot send message: Recipient or group is missing');
        } else {
          alert('Failed to send message: ' + error.message);
        }
        throw error;
      }

      // Update message with server data
      setMessages((prev: Message[]) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...data, sender: currentUser, isPending: false } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Roll back optimistic update
      setMessages((prev: Message[]) => prev.filter((msg) => msg.id !== tempId));
      if (error instanceof Error && error.message !== 'Failed to upload file') {
        alert('Failed to send message');
      }
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  // Create new group
  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.user_type !== 'staff' || !newGroupName.trim() || selectedMembers.length === 0) return;

    try {
      const groupId = uuidv4();
      const { error } = await supabase
        .from('groups')
        .insert({
          id: groupId,
          name: newGroupName.trim(),
          creator_id: currentUser.id,
          members: [...selectedMembers, currentUser.id],
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      const newGroup: Group = {
        id: groupId,
        name: newGroupName.trim(),
        creator_id: currentUser.id,
        members: [...selectedMembers, currentUser.id],
        created_at: new Date().toISOString()
      };

      setGroups(prev => [...prev, newGroup]);
      setChats(prev => [{
        id: groupId,
        group: newGroup
      }, ...prev]);
      setNewGroupName('');
      setSelectedMembers([]);
      setShowGroupCreator(false);
      setSelectedChat({ id: groupId, group: newGroup });
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  // Toggle member selection for group
  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Start chat with user
  const startChat = (user: User) => {
    console.log('Starting chat with user:', { userId: user.id, user });
    setSelectedChat({ id: user.id, user });
    setView('chats');
    setMessages([]);
  };

  // Start group chat
  const startGroupChat = (group: Group) => {
    console.log('Starting group chat:', { groupId: group.id, group });
    setSelectedChat({ id: group.id, group });
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
      <div className={`w-full md:w-80 lg:w-96 border-r ${darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'} 
        fixed md:relative h-full z-40 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className={`p-4 border-b ${darkMode ? 'border-[#2A3744]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold">
              {currentUser.first_name[0]}{currentUser.surname[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{currentUser.first_name} {currentUser.surname}</h2>
              <p className={`text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'} truncate`}>
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
            <button
              onClick={() => setView('groups')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                view === 'groups'
                  ? 'bg-[#2563EB] text-white'
                  : darkMode
                  ? 'bg-[#1E2A38] text-[#A0B3C6] hover:bg-[#2A3744]'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {view === 'users' ? (
            <div className="space-y-2">
              <h3 className="font-semibold mb-3 text-sm md:text-base">All Users</h3>
              {users.map(user => (
                <div
                  key={user.id}
                  onClick={() => startChat(user)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    darkMode ? 'hover:bg-[#2A3744]' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm">
                        {user.first_name[0]}{user.surname[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-2 h-2 md:w-3 md:h-3 rounded-full border-2 ${
                        user.online ? 'bg-green-500' : 'bg-gray-400'
                      } ${darkMode ? 'border-[#1E2A38]' : 'border-white'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm md:text-base">{user.first_name} {user.surname}</p>
                      <p className={`text-xs md:text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'} truncate`}>
                        Level {user.level}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : view === 'groups' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm md:text-base">Groups</h3>
                {currentUser.user_type === 'staff' && (
                  <button
                    onClick={() => setShowGroupCreator(true)}
                    className="p-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1E40AF]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              {showGroupCreator && currentUser.user_type === 'staff' ? (
                <div className="p-3 rounded-lg bg-[#2A3744]">
                  <form onSubmit={createGroup}>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Group name"
                      className={`w-full px-3 py-2 mb-2 rounded-lg border text-sm ${
                        darkMode
                          ? 'bg-[#1E2A38] border-[#2A3744] text-[#E2E8F0] placeholder-[#A0B3C6]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:border-[#2563EB]`}
                    />
                    <div className="mb-2 max-h-40 overflow-y-auto">
                      {users.map(user => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 p-2 hover:bg-[#3B82F6] cursor-pointer"
                          onClick={() => toggleMember(user.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(user.id)}
                            onChange={() => toggleMember(user.id)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{user.first_name} {user.surname}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={!newGroupName.trim() || selectedMembers.length === 0}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#2563EB] text-white disabled:opacity-50 hover:bg-[#1E40AF]"
                      >
                        Create Group
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowGroupCreator(false);
                          setNewGroupName('');
                          setSelectedMembers([]);
                        }}
                        className="flex-1 py-2 px-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                groups.map(group => (
                  <div
                    key={group.id}
                    onClick={() => startGroupChat(group)}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedChat?.id === group.id
                        ? 'bg-[#2563EB] text-white'
                        : darkMode
                        ? 'hover:bg-[#2A3744]'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm flex-shrink-0">
                        {group.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm md:text-base">{group.name}</p>
                        {group.members && (
                          <p className={`text-xs truncate ${
                            selectedChat?.id === group.id ? 'text-blue-100' : darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'
                          }`}>
                            {group.members.length} members
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold mb-3 text-sm md:text-base">Your Chats</h3>
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => chat.group ? startGroupChat(chat.group) : startChat(chat.user!)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedChat?.id === chat.id
                      ? 'bg-[#2563EB] text-white'
                      : darkMode
                      ? 'hover:bg-[#2A3744]'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm flex-shrink-0">
                      {chat.group ? chat.group.name[0].toUpperCase() : `${chat.user!.first_name[0]}${chat.user!.surname[0]}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm md:text-base">
                        {chat.group ? chat.group.name : `${chat.user!.first_name} ${chat.user!.surname}`}
                      </p>
                      {chat.last_message && (
                        <p className={`text-xs truncate ${
                          selectedChat?.id === chat.id ? 'text-blue-100' : darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'
                        }`}>
                          {chat.last_message.file_attachment ? (
                            <span className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{chat.last_message.file_attachment.file_name}</span>
                            </span>
                          ) : (
                            <span className="truncate">{chat.last_message.text}</span>
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
            <div className={`p-3 md:p-4 border-b flex items-center gap-3 ${
              darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'
            }`}>
              <button
                onClick={() => {
                  setSelectedChat(null);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(true);
                  }
                }}
                className="p-1 md:p-2 rounded-lg hover:bg-[#2A3744] dark:hover:bg-[#2A3744]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm flex-shrink-0">
                {selectedChat.group ? selectedChat.group.name[0].toUpperCase() : `${selectedChat.user!.first_name[0]}${selectedChat.user!.surname[0]}`}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-sm md:text-base truncate">
                  {selectedChat.group ? selectedChat.group.name : `${selectedChat.user!.first_name} ${selectedChat.user!.surname}`}
                </h1>
                <p className={`text-xs md:text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'} truncate`}>
                  {selectedChat.group ? `${selectedChat.group.members.length} members` : `Level ${selectedChat.user!.level}`}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-md px-3 py-2 md:px-4 md:py-2 rounded-lg ${
                      message.sender_id === currentUser.id
                        ? `bg-[#2563EB] text-white ${message.isPending ? 'opacity-75' : ''}`
                        : darkMode
                        ? 'bg-[#1E2A38] text-[#E2E8F0]'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-xs font-medium">{message.sender?.first_name} {message.sender?.surname}</p>
                    {message.text && <p className="mb-2 break-words text-sm md:text-base">{message.text}</p>}
                    
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
                            <p className="text-xs md:text-sm font-medium truncate">
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
              <div className={`p-3 md:p-4 border-t ${
                darkMode ? 'bg-[#1E2A38] border-[#2A3744]' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`p-3 rounded-lg border ${
                  darkMode ? 'border-[#2A3744] bg-[#1E2A38]' : 'border-gray-300 bg-white'
                }`}>
                  <div className="flex items-center gap-3">
                    {getFileIcon(selectedFile.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">{selectedFile.name}</p>
                      <p className={`text-xs md:text-sm ${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'}`}>
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1 rounded hover:bg-[#2A3744] dark:hover:bg-[#2A3744] flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={sendMessage} className={`p-3 md:p-4 border-t ${
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
                  className="p-2 rounded-lg hover:bg-[#2A3744] dark:hover:bg-[#2A3744] flex-shrink-0"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 md:px-4 md:py-2 rounded-lg border text-sm md:text-base ${
                    darkMode
                      ? 'bg-[#1E2A38] border-[#2A3744] text-[#E2E8F0] placeholder-[#A0B3C6]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:border-[#2563EB]`}
                  aria-label="Type a message"
                />
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !selectedFile) || sending}
                  className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-white flex items-center gap-1 md:gap-2 ${
                    darkMode
                      ? 'bg-[#4B91F1] hover:bg-[#3B82F6]'
                      : 'bg-[#2563EB] hover:bg-[#1E40AF]'
                  } disabled:opacity-50 flex-shrink-0`}
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
            <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mb-4 text-gray-400" />
            <h2 className="text-lg md:text-xl font-semibold mb-2">Select a Chat</h2>
            <p className={`${darkMode ? 'text-[#A0B3C6]' : 'text-gray-600'} mb-6 text-sm md:text-base`}>
              Choose a conversation or start a new one
            </p>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] text-sm md:text-base"
            >
              Open Chats
            </button>
          </div>
        )}
      </div>
    </div>
  );
}