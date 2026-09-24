import {StreamChat} from "stream-chat";
import "dotenv/config";

// load the credentials of the stream.io
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// if any of these is missing print error
if(!apiKey || !apiSecret)
{
  console.error("Stream API Key or Secret Key is missing");
}

// create server side client to communicate with the stream server using the api calls
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Creating or updating the user in the stream
export const upsertStreamUser = async (userData) => {

  try{
    // upsertUsers means -> create user if not exist and update if exists
    await streamClient.upsertUsers([userData]);
    return userData;
  }
  catch(error){
    console.error("Error upserting Stream User ", error)
  }
};

// TODO : doit later 
export const generateStreamToken = (userId) => {
  try{
    //ensure the user id is string
    const userIdStr = userId.toString();

    // create the token and return it 
    return streamClient.createToken(userIdStr);
  }
  catch(error){
    console.error("Error generating stream token ", error)
  }
};