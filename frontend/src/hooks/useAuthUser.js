import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

// This is used to fetch the userData which is currently logged-in
const useAuthUser = () => {
  
  // This is protectRoute which checks the user is logged-in(authenticate) or not. 
  // If user is logged-in, its data is stored in the authUser 

  const authUser = useQuery({  // TanStack Query
    queryKey : ["authUser"], // store the chache with name 'authUser'
    queryFn : getAuthUser,
    retry: false,
  });

  // "authUser" is the object that contain the different things return by the React Query ("useQuery")
  // we just return the useful things from it 
  return {isLoading : authUser.isLoading, authUser : authUser.data?.user};
}

export default useAuthUser