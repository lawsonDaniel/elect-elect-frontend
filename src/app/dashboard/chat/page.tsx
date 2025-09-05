'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Database } from '@/lib/database.types';
import { Send, Users, Clock, Paperclip, ThumbsUp, ArrowLeft, Menu, X, MessageCircle, Search, Wifi, WifiOff } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Poppins, Space_Grotesk } from 'next/font/google';
import { getCookie } from 'cookies-next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

type Profile = Database['public']['Tables']['profiles']['Row'];
type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  members: { user_id: string }[];
};
type Message = Database['public']['Tables']['messages']['Row'] & {
  profile: Profile;
  reactions: { emoji: string; user_id: string }[];
};
type TypingUser = Database['public']['Tables']['typing_indicators']['Row'] & {
  profile: Profile;
};

interface ChatProps {
  currentUser?: Profile | null;
}

export default function Chat({ currentUser: propCurrentUser }: ChatProps) {
  const [currentUser, setCurrentUser] = useState<Profile | null>(propCurrentUser || null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [groupMembers, setGroupMembers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [activeView, setActiveView] = useState<'conversations' | 'users' | 'chat'>('users');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const { darkMode } = useDarkMode();

  // Get user from cookies if not provided as prop
  useEffect(() => {
    const getUserFromCookies = () => {
      try {
        const userCookie = getCookie('user-info');
        if (userCookie) {
          const userData = JSON.parse(userCookie as string);
          setCurrentUser(userData);
          return userData;
        }
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
      return null;
    };

    if (!propCurrentUser) {
      const user = getUserFromCookies();
      if (!user) {
        setLoading(false);
        console.error('No authenticated user found');
      } else {
        setCurrentUser(user);
      }
    } else {
      setLoading(false);
    }
  }, [propCurrentUser]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load conversations and setup initial data
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);
    loadConversations();
    joinOrCreateLevelGroup();
    loadAllUsers();
    setUserOnline();
    startHeartbeat();
    setLoading(false);
  }, [currentUser]);

  // Set up presence system and real-time subscriptions
  useEffect(() => {
    if (!currentUser) return;

    // Listen for profile changes (online status updates)
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            loadAllUsers(); // Reload users when any profile is updated
          }
        }
      )
      .subscribe();

    // Set up presence for real-time user tracking
    const presenceChannel = supabase.channel('online_users');
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const presenceUsers = Object.values(state).flat() as any[];
        
        // Update database with current presence
        updateOnlineStatus(presenceUsers);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
        loadAllUsers();
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
        // Mark users as offline in database
        leftPresences.forEach(async (user: any) => {
          await supabase
            .from('profiles')
            .update({ 
              online: false, 
              last_seen: new Date().toISOString() 
            })
            .eq('id', user.id);
        });
        loadAllUsers();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            id: currentUser?.id,
            first_name: currentUser?.first_name,
            surname: currentUser?.surname,
            school_email: currentUser?.school_email,
            level: currentUser?.level,
            online: true,
            last_seen: new Date().toISOString(),
          });
        }
      });

    const handleBeforeUnload = async () => {
      await setUserOffline();
      await presenceChannel.untrack();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      setUserOffline();
      presenceChannel.untrack().then(() => supabase.removeChannel(presenceChannel));
      supabase.removeChannel(profilesChannel);
    };
  }, [currentUser]);

  // Subscribe to messages, typing, and reactions for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const channelName = `chat:${selectedConversation.id}`;
    const chatChannel = supabase.channel(channelName);

    chatChannel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          fetchMessageWithProfile(payload.new as Message);
          markAsRead(payload.new.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          handleTypingUpdate(payload.new as TypingUser);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reactions',
        },
        (payload) => {
          updateMessageReaction(payload.new);
        }
      )
      .subscribe();

    loadMessages(selectedConversation.id);
    if (selectedConversation.type === 'group') {
      loadGroupMembers(selectedConversation.level!);
    }

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set current user as online in database
  const setUserOnline = async () => {
    // Check if currentUser and currentUser.id exist
    if (!currentUser?.id) {
      console.error('Cannot set user online: currentUser.id is undefined');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          online: true, 
          last_seen: new Date().toISOString() 
        })
        .eq('id', currentUser.id); // Now guaranteed to be valid

      if (error) {
        console.error('Error setting user online:', error);
      }
    } catch (error) {
      console.error('Error setting user online:', error);
    }
  };

  // Set current user as offline in database
  const setUserOffline = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          online: false, 
          last_seen: new Date().toISOString() 
        })
        .eq('id', currentUser?.id);

      if (error) {
        console.error('Error setting user offline:', error);
      }
    } catch (error) {
      console.error('Error setting user offline:', error);
    }
  };

  // Start heartbeat to keep user online
  const startHeartbeat = () => {
    heartbeatRef.current = setInterval(async () => {
      if (isOnline) {
        await setUserOnline();
      }
    }, 30000); // Update every 30 seconds
  };

  // Update online status based on presence
  const updateOnlineStatus = async (presenceUsers: any[]) => {
    const onlineUserIds = presenceUsers.map(user => user.id);
    
    if (onlineUserIds.length > 0) {
      try {
        // Set present users as online
        await supabase
          .from('profiles')
          .update({ 
            online: true, 
            last_seen: new Date().toISOString() 
          })
          .in('id', onlineUserIds);
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    }
  };

  // Load all users from database
  const loadAllUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'student')
        .order('online', { ascending: false })
        .order('last_seen', { ascending: false });

      // Only add the neq filter if currentUser.id exists
      if (currentUser?.id) {
        query = query.neq('id', currentUser.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading users:', error);
        throw error;
      }
      
      setAllUsers(data || []);
      // Filter online users
      const onlineUsers = (data || []).filter(user => user.online);
      setActiveUsers(onlineUsers);
      console.log('Active users:', onlineUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setAllUsers([]);
      setActiveUsers([]);
    }
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          members:conversation_members(user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
        return;
      }

      // Filter conversations where current user is a member
      const userConversations = (data || []).filter(convo => 
        convo.members.some((member: any) => member.user_id === currentUser?.id)
      );

      setConversations(userConversations as Conversation[]);
    } catch (error) {
      console.error('Unexpected error loading conversations:', error);
      setConversations([]);
    }
  };

  const joinOrCreateLevelGroup = async () => {
    try {
      const { data: existingGroup, error: groupError } = await supabase
        .from('conversations')
        .select('*')
        .eq('type', 'group')
        .eq('level', currentUser?.level)
        .single();

      let groupId;
      if (existingGroup) {
        groupId = existingGroup.id;
      } else {
        const { data: newGroup, error: createError } = await supabase
          .from('conversations')
          .insert({
            type: 'group',
            name: `${currentUser?.level} Group`,
            level: currentUser?.level,
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating group:', createError);
          return;
        }
        groupId = newGroup.id;
      }

      // Check if user is already a member
      const { data: membership } = await supabase
        .from('conversation_members')
        .select('*')
        .eq('conversation_id', groupId)
        .eq('user_id', currentUser?.id)
        .single();

      if (!membership) {
        await supabase
          .from('conversation_members')
          .insert({
            conversation_id: groupId,
            user_id: currentUser?.id,
          });
      }

      loadConversations();
    } catch (error) {
      console.error('Error joining/creating level group:', error);
    }
  };

  const startPrivateChat = async (targetUser: Profile) => {
    try {
      // Check if conversation already exists
      const { data: existingConvo, error: convoError } = await supabase
        .from('conversations')
        .select(`
          *,
          members:conversation_members!inner(user_id)
        `)
        .eq('type', 'private')
        .filter('members.user_id', 'in', `(${currentUser?.id},${targetUser.id})`)
        .single();

      let convoId;
      if (existingConvo && existingConvo.members.length === 2) {
        convoId = existingConvo.id;
      } else {
        const { data: newConvo, error: createError } = await supabase
          .from('conversations')
          .insert({
            type: 'private',
            name: `${currentUser?.first_name} & ${targetUser.first_name}`,
          })
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating private conversation:', createError);
          throw createError;
        }
        convoId = newConvo.id;

        await supabase
          .from('conversation_members')
          .insert([
            { conversation_id: convoId, user_id: currentUser?.id },
            { conversation_id: convoId, user_id: targetUser.id },
          ]);
      }

      const newConversation = {
        id: convoId,
        type: 'private',
        name: `${targetUser.first_name} ${targetUser.surname}`,
        members: [{ user_id: targetUser.id }],
      } as Conversation;

      setSelectedConversation(newConversation);
      setActiveView('chat');
      setShowSidebar(false);
      loadConversations();
    } catch (error) {
      console.error('Error starting private chat:', error);
    }
  };

  const loadMessages = async (convoId: string) => {
    try {
      // First get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*, reactions(*)')
        .eq('conversation_id', convoId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (messagesError) throw messagesError;

      // Then get profiles separately
      const userIds = [...new Set(messagesData.map(m => m.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, surname, school_email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData = messagesData.map(message => ({
        ...message,
        profile: profilesData.find(profile => profile.id === message.user_id)
      }));

      setMessages(combinedData as Message[]);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const loadGroupMembers = async (level: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, surname, school_email, online, last_seen')
        .eq('level', level)
        .eq('user_type', 'student')
        .order('online', { ascending: false })
        .order('first_name', { ascending: true });

      if (error) {
        console.error('Error loading group members:', error);
        throw error;
      }

      setGroupMembers(data as Profile[]);
    } catch (error) {
      console.error('Unexpected error loading group members:', error);
    }
  };

  const fetchMessageWithProfile = async (message: Message) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, first_name, surname, school_email')
        .eq('id', message.user_id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setMessages((prev) => [...prev, { ...message, profile, reactions: [] }]);
      }
    } catch (error) {
      console.error('Unexpected error fetching message profile:', error);
    }
  };

  const handleTypingUpdate = async (typingData: TypingUser) => {
    if (typingData.user_id === currentUser?.id) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, first_name, surname, school_email')
        .eq('id', typingData.user_id)
        .single();

      if (error || !profile) return;

      if (typingData.typing) {
        setTypingUsers((prev) => {
          if (!prev.find((u) => u.user_id === typingData.user_id)) {
            return [...prev, { ...typingData, profile }];
          }
          return prev;
        });
      } else {
        setTypingUsers((prev) =>
          prev.filter((u) => u.user_id !== typingData.user_id)
        );
      }
    } catch (error) {
      console.error('Unexpected error handling typing update:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if currentUser and currentUser.id exist
    if (!currentUser?.id) {
      console.error('No authenticated user found');
      alert('You must be logged in to send messages');
      return;
    }

    if ((!messageText.trim() && !file) || !selectedConversation) return;

    try {
      let fileUrl = null;
      if (file) {
        const { data, error: uploadError } = await supabase.storage
          .from('chat-files')
          .upload(`${currentUser.id}/${Date.now()}_${file.name}`, file);
          
        if (uploadError) {
          console.error('File upload error:', uploadError);
          alert('Failed to upload file.');
          return;
        }
        
        fileUrl = supabase.storage
          .from('chat-files')
          .getPublicUrl(data.path).data.publicUrl;
        setFile(null);
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          text: messageText,
          user_id: currentUser.id, // Now guaranteed to be valid
          conversation_id: selectedConversation.id,
          file_url: fileUrl,
        });

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setMessageText('');
      stopTypingIndicator();
    } catch (error) {
      console.error('Unexpected error sending message:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          read_by: supabase.sql(`array_append_unique(read_by, '${currentUser?.id}')`),
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking message as read:', error);
      }
    } catch (error) {
      console.error('Unexpected error marking message as read:', error);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const { error } = await supabase
        .from('reactions')
        .insert({
          message_id: messageId,
          user_id: currentUser?.id,
          emoji,
        });

      if (error) {
        console.error('Error adding reaction:', error);
      }
    } catch (error) {
      console.error('Unexpected error adding reaction:', error);
    }
  };

  const updateMessageReaction = (newReaction: {
    message_id: string;
    emoji: string;
    user_id: string;
  }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === newReaction.message_id
          ? { ...msg, reactions: [...msg.reactions, newReaction] }
          : msg
      )
    );
  };

  const startTypingIndicator = async () => {
    if (!selectedConversation) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: currentUser?.id,
          conversation_id: selectedConversation.id,
          typing: true,
          updated_at: new Date().toISOString(),
        });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTypingIndicator();
      }, 3000);
    } catch (error) {
      console.error('Error starting typing indicator:', error);
    }
  };

  const stopTypingIndicator = async () => {
    if (!selectedConversation) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: currentUser?.id,
          conversation_id: selectedConversation.id,
          typing: false,
          updated_at: new Date().toISOString(),
        });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error('Error stopping typing indicator:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const filteredUsers = allUsers.filter((user) =>
    `${user.first_name} ${user.surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const onlineFilteredUsers = filteredUsers.filter(user => user.online);
  const offlineFilteredUsers = filteredUsers.filter(user => !user.online);

  const selectConversation = (convo: Conversation) => {
    setSelectedConversation(convo);
    setActiveView('chat');
    setShowSidebar(false);
  };

  const backToUsers = () => {
    setActiveView('users');
    setSelectedConversation(null);
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Mobile sidebar overlay
  const SidebarOverlay = () => (
    showSidebar && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={() => setShowSidebar(false)}
      />
    )
  );

  // User card component
  const UserCard = ({ user, isOnline }: { user: Profile; isOnline: boolean }) => (
    <div
      key={user.id}
      onClick={() => startPrivateChat(user)}
      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
        darkMode
          ? 'bg-[#101E27] border-[#1a2e3a] hover:border-blue-500 hover:bg-[#1a2e3a]'
          : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
      } shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
              darkMode
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
            }`}
          >
            {user.first_name[0]}
            {user.surname[0]}
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}
          ></div>
        </div>
        <div className="flex-1">
          <h3
            className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {user.first_name} {user.surname}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Level {user.level}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs mb-3">
        {isOnline ? (
          <>
            <Wifi className={`w-3 h-3 text-green-500`} />
            <span className="text-green-500">Online now</span>
          </>
        ) : (
          <>
            <WifiOff className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last seen {formatLastSeen(user.last_seen)}
            </span>
          </>
        )}
      </div>
      <div
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          isOnline
            ? darkMode
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            : darkMode
            ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
            : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
        }`}
      >
        <MessageCircle className="w-4 h-4" />
        {isOnline ? 'Start Chat' : 'Message'}
      </div>
    </div>
  );

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  // No user component
  const NoUserComponent = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <Users className="w-16 h-16 mb-4 text-gray-400" />
      <h2 className="text-xl font-semibold mb-2">No User Found</h2>
      <p className="text-gray-500 mb-6">Please log in to use the chat feature</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );

  // Main content based on active view
  const renderMainContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (!currentUser) {
      return <NoUserComponent />;
    }

    if (activeView === 'users') {
      return (
        <div className={`flex-1 flex flex-col ${darkMode ? 'bg-[#070E12]' : 'bg-white'}`}>
          <div
            className={`p-6 border-b ${
              darkMode ? 'bg-[#101E27] border-[#1a2e3a]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h1
                className={`text-2xl font-bold ${spaceGrotesk.className} ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Find Users
              </h1>
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
                    darkMode
                      ? 'bg-[#070E12] text-green-400'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {activeUsers.length} online
                </div>
                <button
                  onClick={() => setShowSidebar(true)}
                  className={`md:hidden p-2 rounded-lg ${
                    darkMode ? 'bg-[#070E12] text-white' : 'bg-white text-gray-700'
                  } shadow-sm`}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users to start a chat..."
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors ${
                  darkMode
                    ? 'bg-[#070E12] border-[#1a2e3a] text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {filteredUsers.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-sm">
                  {searchQuery ? 'Try adjusting your search query' : 'No users available'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Online Users Section */}
                {onlineFilteredUsers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Online ({onlineFilteredUsers.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {onlineFilteredUsers.map((user) => (
                        <UserCard key={`online-${user.id}`} user={user} isOnline={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Offline Users Section */}
                {offlineFilteredUsers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Offline ({offlineFilteredUsers.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {offlineFilteredUsers.map((user) => (
                        <UserCard key={`offline-${user.id}`} user={user} isOnline={false} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeView === 'chat' && selectedConversation) {
      return (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div
            className={`p-4 border-b flex items-center gap-3 ${
              darkMode ? 'bg-[#101E27] border-[#1a2e3a]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <button
              onClick={backToUsers}
              className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1
                className={`text-lg font-semibold ${spaceGrotesk.className} ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {selectedConversation.name}
              </h1>
              {selectedConversation.type === 'group' ? (
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Group chat • {groupMembers.length} members
                </p>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Private conversation
                </p>
              )}
            </div>
            <button
              onClick={() => setShowUsersList(!showUsersList)}
              className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors md:hidden ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl ${
                    message.user_id === currentUser?.id
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-[#101E27] text-[#EDF3F8]'
                      : 'bg-gray-100 text-gray-800'
                  } shadow-sm`}
                >
                  {message.user_id !== currentUser?.id && (
                    <div
                      className={`font-medium text-xs mb-2 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {message.profile.first_name} {message.profile.surname}
                    </div>
                  )}
                  {message.text && <div className="text-sm mb-2">{message.text}</div>}
                  {message.file_url && (
                    <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={message.file_url}
                        alt="attachment"
                        className="max-w-full rounded-lg"
                      />
                    </a>
                  )
                  }
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2">
                      {message.reactions.map((r, idx) => (
                        <span key={idx} className="text-xs">
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addReaction(message.id, '👍')}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <div className={`text-xs opacity-70 flex items-center gap-1`}>
                        <Clock className="w-3 h-3" />
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div
                className={`flex items-center gap-3 px-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <span className="text-sm">
                  {typingUsers
                    .map(
                      (typingData) =>
                        `${typingData.profile.first_name} ${typingData.profile.surname}`
                    )
                    .join(', ')}{' '}
                  {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={sendMessage}
            className={`p-4 border-t ${
              darkMode ? 'bg-[#101E27] border-[#1a2e3a]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-[#070E12]'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white'
                }`}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (e.target.value.trim()) startTypingIndicator();
                    else stopTypingIndicator();
                  }}
                  placeholder="Type a message..."
                  className={`w-full px-4 py-3 rounded-xl text-sm border-2 transition-colors ${
                    darkMode
                      ? 'bg-[#070E12] border-[#1a2e3a] text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none`}
                />
                {file && (
                  <div
                    className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-lg text-xs ${
                      darkMode ? 'bg-[#070E12] text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    File selected: {file.name}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!messageText.trim() && !file}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      );
    }

    return null;
  };

  // Sidebar content
  const renderSidebarContent = () => {
    if (!currentUser) return null;
    
    if (activeView === 'chat' && selectedConversation) {
      return selectedConversation.type === 'group' ? (
        <div className="p-6">
          <h3
            className={`font-semibold mb-4 flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Group Members ({groupMembers.length})
          </h3>
          <div className="space-y-3">
            {groupMembers.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-[#070E12]' : 'hover:bg-white'
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      darkMode
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
                    }`}
                  >
                    {member.first_name[0]}
                    {member.surname[0]}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                      member.online ? 'bg-green-500 border-white' : 'bg-gray-500 border-white'
                    }`}
                  ></div>
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium text-sm ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {member.first_name} {member.surname}
                  </div>
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      member.online
                        ? 'text-green-500'
                        : darkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.online ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></div>
                    {member.online ? 'Online' : `Last seen ${formatLastSeen(member.last_seen)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <h3
            className={`font-semibold mb-4 flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <Users className="w-5 h-5" />
            Chat Info
          </h3>
          <div className="text-center py-8">
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white ${
                darkMode
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500'
              }`}
            >
              {selectedConversation.name?.split(' ').map((n) => n[0]).join('') || 'DM'}
            </div>
            <h4
              className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              {selectedConversation.name}
            </h4>
            <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Private conversation
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <h3
          className={`font-semibold mb-4 flex items-center gap-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          Recent Chats
        </h3>
        <div className="space-y-2">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => selectConversation(convo)}
              className={`p-3 cursor-pointer rounded-xl transition-all duration-200 ${
                selectedConversation?.id === convo.id
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'hover:bg-[#070E12] text-gray-300 hover:text-white'
                  : 'hover:bg-white text-gray-700 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    selectedConversation?.id === convo.id
                      ? 'bg-white bg-opacity-20 text-white'
                      : darkMode
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
                  }`}
                >
                  {convo.type === 'group' ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    convo.name?.[0] || 'D'
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm truncate">
                    {convo.type === 'group' ? convo.name : convo.name}
                  </div>
                  <div
                    className={`text-xs ${
                      selectedConversation?.id === convo.id
                        ? 'text-white text-opacity-80'
                        : darkMode
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {convo.type === 'group' ? `Level ${convo.level} group` : 'Private chat'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`w-full h-screen flex ${poppins.className} ${
        darkMode ? 'bg-[#070E12] text-[#EDF3F8]' : 'bg-white text-gray-900'
      }`}
    >
      <SidebarOverlay />

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block w-80 border-r ${
          darkMode ? 'bg-[#101E27] border-[#1a2e3a]' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex flex-col h-full">
          <div
            className={`p-6 border-b ${darkMode ? 'border-[#1a2e3a]' : 'border-gray-200'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  darkMode
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                }`}
              >
                {currentUser?.first_name?.[0] || 'U'}
                {currentUser?.surname?.[0] || 'S'}
              </div>
              <div>
                <h2
                  className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {currentUser?.first_name || 'User'} {currentUser?.surname || ''}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Level {currentUser?.level || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('users')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'users'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-[#070E12] text-gray-300 hover:text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                Find Users
              </button>
              <button
                onClick={() => setActiveView('conversations')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'conversations'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-[#070E12] text-gray-300 hover:text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                Chats
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{renderSidebarContent()}</div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } ${darkMode ? 'bg-[#101E27]' : 'bg-white'} shadow-xl`}
      >
        <div className="flex flex-col h-full">
          <div
            className={`p-6 border-b ${darkMode ? 'border-[#1a2e3a]' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    darkMode
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-blue-400 to-purple-500'
                  }`}
                >
                  {currentUser?.first_name?.[0] || 'U'}
                  {currentUser?.surname?.[0] || 'S'}
                </div>
                <div>
                  <h2
                    className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {currentUser?.first_name || 'User'} {currentUser?.surname || ''}
                  </h2>
                  <p
                    className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Level {currentUser?.level || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveView('users');
                  setShowSidebar(false);
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'users'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-[#070E12] text-gray-300 hover:text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                Find Users
              </button>
              <button
                onClick={() => {
                  setActiveView('conversations');
                  setShowSidebar(false);
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'conversations'
                    ? 'bg-blue-500 text-white'
                    : darkMode
                    ? 'bg-[#070E12] text-gray-300 hover:text-white'
                    : 'bg-white text-gray-600 hover:text-gray-900'
                }`}
              >
                Chats
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{renderSidebarContent()}</div>
        </div>
      </div>

      {/* Main Content */}
      {renderMainContent()}

      {/* Mobile Users List Overlay for Chat View */}
      {showUsersList && activeView === 'chat' && selectedConversation?.type === 'group' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div
            className={`absolute right-0 top-0 h-full w-80 ${
              darkMode ? 'bg-[#101E27]' : 'bg-white'
            } shadow-xl`}
          >
            <div
              className={`p-4 border-b ${
                darkMode ? 'border-[#1a2e3a]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Group Members
                </h3>
                <button
                  onClick={() => setShowUsersList(false)}
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {groupMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    darkMode ? 'bg-[#070E12]' : 'bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                        darkMode
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                          : 'bg-gradient-to-br from-blue-400 to-purple-500'
                      }`}
                    >
                      {member.first_name[0]}
                      {member.surname[0]}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                        member.online ? 'bg-green-500 border-white' : 'bg-gray-500 border-white'
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {member.first_name} {member.surname}
                    </div>
                    <div
                      className={`text-xs ${
                        member.online
                          ? 'text-green-500'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {member.online ? 'Online' : `Last seen ${formatLastSeen(member.last_seen)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}