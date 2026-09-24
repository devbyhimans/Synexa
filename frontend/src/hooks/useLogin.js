import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api.js";
import toast from "react-hot-toast";

const useLogin = () => {
  
  const queryClient = useQueryClient();

  // here is the mutation TanStack Query call from inside the "handleLogin" function in "LoginPage.jsx"
  const {mutate, isPending, error} = useMutation({
    mutationFn : login, // call the "login" function that is define in the /lib/api.js to make the api call
    onSuccess : () => {
      toast.success("Login Successfully");  // pop-up notification with the message
      queryClient.invalidateQueries({queryKey: ["authUser"]});  // re-fetch the userData when the login is successfull
    }
  });

  return {loginMutation : mutate, isPending, error};
}

export default useLogin