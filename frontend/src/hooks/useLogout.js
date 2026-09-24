import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";

// here is the mutation TanStack Query call from inside the "Navbar" when we click on the logout button
const useLogout = () => {

  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending, error } = useMutation( {
    mutationFn: logout, // call the "logout" function that is define in the /lib/api.js to make the api call
    onSuccess: () => {
      toast.success("Logout Successfully");  // pop-up notification with the message
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // re-fetch the userData again
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;