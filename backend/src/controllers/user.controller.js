import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers (req, res) {
  
  try{
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUser = await User.find({
      $and : [  // query operator
          { _id : {$ne: currentUserId}},  //exclude  current user
          { _id : {$nin: currentUser.friends}}, // exclude current user's friend
          { isOnboarded: true}
      ],
    });
    res.status(200).json(recommendedUser);
  }
  catch(error){
    console.error("Error in getRecommendedUsers Route", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function getMyFriends (req, res) {

  try{
    const user = await User.findById(req.user._id)
      .select("friends")  // select only the friend field of the user data
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage"); // poulate and select only required fields
    
    res.status(200).json(user.friends);
  }
  catch(error){
    console.error("Error in getMyFriends Route", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export async function sendFriendRequest (req, res) {
  try{
    const myId = req.user._id;
    const { id:recipientId} = req.params;

    // prevent sending request to myself 
    if(myId.toString() === recipientId){  // myId is in form of objet so first convert it into the string
      return res.status(400).json({message:"You cannot send friend request to yourself"});
    }

    const recipient = await User.findById(recipientId);
    if(!recipient){
      return res.status(400).json({message:"Recipient not found or it does not exists"});
    }

    // check if your are already friends
    if(recipient.friends.includes(myId)){
      return res.status(400).json({message:"You are already friend witht the user"});
    }

    // check friend request already exist 
    const existingRequest = await FriendRequest.findOne({
      $or : [
        {sender : myId, recipient : recipientId}, // you already send friend request to user
        {sender : recipientId, recipient : myId}, // uesr already send friend request to you
      ],
    });

    if(existingRequest){
      return res.status(400).json({message:"A Friend Request already exists between you and this user"});
    }

    // now finally after clearing all checks we create the friend request
    const friendRequest = await FriendRequest.create({
      sender : myId,
      recipient : recipientId,
    });

    res.status(201).json(friendRequest);
  }
  catch(error){
    console.error("Error in the FriendRequest controller", error.message);
    res.status(500).json({message:'Internal server error'});
  }
}

export async function acceptFriendRequest (req, res) {

  try {
    const { id:requestId } = req.params;  //this is the FriendRequest id(that sore the sender and recipient ids)

    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest){
      return res.status(400).json({message:"Friend Request not found"});
    }

    // Verify the current user is the recipient
    // curr user means jo user abhi logged-in hai jiski details hme req.user se milegi (which we save in protectRoute middleware) 
    //agar current user hi "friendRequest" ka recipient hua to wo us req ko accept kr sakega otherwise no
    if(friendRequest.recipient.toString() !== req.user._id.toString()){
      return res.status(400).json({message:"You are not authorised to accept this friend request"});
    }

    friendRequest.status = "accepted";  // mark the status as accepted
    await friendRequest.save();

    // now add each user to other's friendList
    // $addToSet -> add element to an array only if they do not already exists

    // search the sender and update its friend array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet : {friends : friendRequest.recipient},
    });
    // search the recipient and update its friend array
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet : {friends : friendRequest.sender},
    });

    res.status(200).json({message:"Friend request accepted"})
  }
  catch(error){
    console.error("Error in the acceptFriendRequest controller", error.message);
    res.status(500).json({message:'Internal server error'});
  }
}

export async function getFriendRequest (req, res) {
  try{
     // we fetch all the incomming friendRequest to the current user
     // as a recipient search kr rhe hai kisne mujhe req bheji hai
    const incomingReqs = await FriendRequest.find({
      recipient : req.user._id,
      status : "pending"
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    // we fetch all the accepted friendRequest that our curr user sends
    // as a sender search kr rhe hai maine kinko req bheji hai
    const acceptedReqs = await User.find({
      sender : req.user._id,
      status : "accepted"
    }).populate("sender", "fullName profilePic");

    res.status(200).json({incomingReqs, acceptedReqs});
  }
  catch(error) {
      console.error("Error in the getFriendRequest route ", error.message);
      res.status(500).json({message:"Internal Server Error"});
  }
}

export async function getOutgoingFriendReqs (req, res) {
  try{
    const outgoingRequests  = await FriendRequest.find({
      sender : req.user._id,
      status : "pending" 
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests );
  }
  catch(error){
    console.error("Error in the getOutgoingFriendReqs route ", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}