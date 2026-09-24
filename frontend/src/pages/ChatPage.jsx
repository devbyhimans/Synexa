import { useEffect, useState } from "react";
import {useParams} from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";


import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import { StreamChat } from "stream-chat";

// import the stream api key from the .env file of the frontend
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

//=============================================  Logic Part ========================================================//

const ChatPage = () => {

  // fetch the if from the url (i.e. /chat/:id )
  const {id:targetUSerId} = useParams();

  // create some state varibale for the chat application
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch the data of the current logged-in user
  const {authUser} = useAuthUser();

  // this query is run automatically after the authUser is available when page render and fetch the streamToken
  const { data:tokenData } = useQuery({
    queryKey : ["streamToken"],
    queryFn : getStreamToken,
    enabled : !!authUser,   // this query will run only after the 'authUser' is available
  });

  useEffect(() => {

    // useEffect diret "async" function nahi hota isliye iske andar async function bnaya hai
    const initChat = async () => {

      // if token is not created or user is not logged in return and donot initialize the chat
      if(!tokenData?.token || !authUser) return;

      try {
        console.log("Initialting the stream chat client . . . .");

        // an hum ek server client bna rhe hai taaki humara server stream se communiate kar paaye using diff methods
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Ye current logged-in user ko Stream server se connect karta hai.
        // Ye Stream ko batata hai : "Ye user currently online hai"
        await client.connectUser(
          {
            id : authUser._id,
            name : authUser.fullName,
            image : authUser.profilePic,
          },
          tokenData.token   // User authentic hai ya fake
        )

        // ab hum apne channel ki ek id bnate hai and ye id is trh designed hai ki same user ke bich channel id hmesha same bnegi
        // eg. if user1_Id:111 and user2_Id:222 to channelId:111-222 
        // ab chahe user1 chat start kare ya user2 inke bich ka channel id same rhega taaki dono user same chatroom me rahe
        const channelId = [authUser._id, targetUSerId].sort().join("-");

        // we told the streaam that we want the messaging type channel and we add two members
        // if the channel is alredy created return the same channel else create the new one and return it
        const currChannel = client.channel("messaging", channelId, {
          members : [authUser._id, targetUSerId],
        });

        // real-time listener start karta hai - Now Stream server continuously updates bhejta hai.
        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel)
      }
      catch (error) {
        console.log("Error initializing chat .....", error);
        toast.error("Could not connect to the chat. Please try again");
      }
      finally {
        setLoading(false);
      }
    }

    initChat();

  }, [tokenData, authUser, targetUSerId]);

  const handleVideoCall = () => {

    if(channel)
    {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text : `I've started the video call. Join me here ${callUrl}`
      });

      toast.success("Video call link send successfully !!");
    }
  }

  // agar chat load ho rha hai ya client created nahi hai ya channel created nahi hai to "ChatLoader" component render karo
  if(loading || !chatClient || !channel) return <ChatLoader />


  //  ================================= UI (Ye pura Stream SDK ka ready-made realtime chat UI hai.) ===============================//


  return (
    <div className="h-[93vh]" >
      <Chat client={chatClient} > {/* Stream chat system initialize karta hai . "chatClient" ko sab child components ko provide karta hai */} 
        <Channel channel={channel}> {/* Current active chat/conversation set karta hai */} 
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/> {/* Custom button for sending video call link */}
            <Window> {/* Main chat area/container */} 
              <ChannelHeader /> {/* Top section show karta hai (user name, online status, etc.) */}   
              <MessageList />  {/* Saare messages display karta hai. ✅ Real-time updates automatically handle karta hai */} 
              <MessageInput focus /> {/* Message type/send karne ka input box."focus" means cursor automatically active rahe */} 
            </Window>
          </div>
          <Thread />  {/* Specific message replies/thread conversations handle karta hai */} 
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage