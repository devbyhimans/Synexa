import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // This is how we did it at first, without using our custom hook
  // const queryClient = useQueryClient();
  // const {mutate:signupMutation, isPending, error} = useMutation ( {
  //   mutationFn: signup, // call th singup function define in the /lib/api.js to make the api call
  //   // if the signup is successful then re-fetch the userData to update the UI using the queryClient
  //   onSuccess : () => queryClient.invalidateQueries({queryKey : ['authUser']}), 
  // });
  //            |
  //            |
  //            v
  // This is how we did it using our custom hook - optimized version
  const {signupMutation, isPending, error} = useSignup();
  
  // when the user click the Submit button we come here
  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData); // trigger the mutation for Api call 
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

        {/*-------------------------------------------- SIGNUP FORM - LEFT SIDE --------------------------------------*/}

        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">

          {/*------------------------------- LOGO ----------------------------*/}

          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Nexus
            </span>
          </div>

          {/*------------------------ ERROR MESSAGE IF ANY --------------------*/}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message || error?.message || "Something went wrong"}</span>
            </div>
          )}

          {/*---------------------------------------- Form starts from here  --------------------------------------*/}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Nexus and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  {/*------------------------------ FULLNAME -------------------------------*/}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Himanshu"
                      className="input input-bordered w-full"
                      value={signupData.fullName} // useState Variable 
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}  // call the useState updater funtion 
                      required
                    />
                  </div>

                  {/*------------------------------- EMAIL --------------------------------*/}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="himanshu@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}  // useState Variable 
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}  // call the useState updater funtion
                      required
                    />
                  </div>

                  {/* ------------------------------PASSWORD ------------------------------*/}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password} // useState Variable 
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}  // call the useState updater funtion
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* ----------------------Term and condition checklist -----------------------*/}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/*--------------------------- Submit button --------------------------- */}
                <button className="btn btn-primary w-full" type="submit">
                  {/* If the signup is procession show loading on button else show "Create Account" */}
                  {isPending ? (  // It is a variable get from the react query when fetch data from the backend api
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
          {/*------------------------------------------------- Form ends here ------------------------------------- */}
        </div>

        {/*------------------------------------------- SIGNUP FORM - RIGHT SIDE ----------------------------------------------*/}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/image2.gif" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;