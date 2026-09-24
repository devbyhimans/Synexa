import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser.js";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css"
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

// import the stream api key from the .env file of the frontend
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

//=============================================  Logic Part ========================================================//

const CallPage = () => {

  // fetch the caller's id from the url (i.e. /call/:id )
  const {id:callId} = useParams();

  // create some state varibale for the chat application
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // fetch the data of the current logged-in user
  const {authUser, isLoading} = useAuthUser();

  // this query is run automatically after the authUser is available when page render and fetch the streamToken
  const { data:tokenData } = useQuery({
    queryKey : ["streamToken"],
    queryFn : getStreamToken,
    enabled : !!authUser,   // this query will run only after the 'authUser' is available
  });

  useEffect(() => {

    // useEffect ke callback ko directly async nahi bana sakte isliye ek alag async function banaya gaya hai
    const initCall = async () => {

      // agar tokenData available nahi hai, ya user login nahi hai, ya URL se callId nahi mila
      // to call initialization mat karo
      if (!tokenData || !callId || !authUser) return;

      try {

        // debugging ke liye console message
        console.log("Initialize Stream Video Client .....");

        // current logged-in user ka object create kar rahe hain
        // ye data Stream SDK ko batata hai ki call me kaun join kar raha hai
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        // Stream Video Client create kar rahe hain, ye Stream server ke sath connection establish karta hai
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY, // Stream project ki unique API key
          user, // current user ki information
          token: tokenData.token, // backend se generated authentication token
        });

        // ek specific call room ko get/create kar rahe hain
        // "default" = call type,  callId = unique room id
        const callInstance = videoClient.call("default", callId);

        // user ko call room me join karwa rahe hain
        // create:true ka matlab: agar room exist nahi karta to automatically create kar do
        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        // client ko React state me store kar rahe hain taki component re-render hone par StreamVideo ko pass kar sake
        setClient(videoClient);

        // current joined call ko state me save kar rahe hain taki StreamCall component use kar sake
        setCall(callInstance);

      } 
      catch (error) {

        // agar call join karne me koi error aaye to console me show karo
        console.error("Error joining call : ", error);

        // user ko toast notification dikhao
        toast.error("Could not join the call. Please try again");

      } finally {

        // finally block hamesha execute hota hai chahe success ho ya error
        // loading state ko false kar rahe hain taki loader hide ho jaye
        setIsConnecting(false);
      }
    };

    // async function ko call kar rahe hain
    initCall();

    // dependency array
    // jab bhi tokenData, authUser, ya callId change hoga ye useEffect dubara run hoga
  }, [tokenData, authUser, callId]);

  if(isConnecting || isLoading) return <PageLoader/>

  //  ================================= UI (Ye pura Stream SDK ka ready-made realtime UI hai.) ===============================//
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;