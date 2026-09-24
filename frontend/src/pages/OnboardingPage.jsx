import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";  // for the popup notification
import { completeOnboarding } from "../lib/api.js";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";  // react icon library
import { LANGUAGES } from "../constants";


const OnboardingPage = () => {


//====================================   It is the logic part not the UI part  ============================================//

  // get the logged-in user's data and isLoading(i.e. query is still running or not)
  const {isLoading, authUser} = useAuthUser();

  const queryClient = useQueryClient();

  // create the useState variable for the form
  const [formState, setFormState] = useState({
    fullName : authUser?.fullName || "",
    email : authUser?.email || "",
    bio : authUser?.bio || "",
    nativeLanguage : authUser?.nativeLanguage || "",
    learningLanguage : authUser?.learningLanguage || "",
    location : authUser?.location || "",
    profilePic : authUser?.profilePic || "",
  });

  // here is the mutation TanStack Query call from inside the "handleSubmit" function 
  const {mutate:onboardingMutation, isPending} = useMutation({
    mutationFn : completeOnboarding, // call the completeOnboarding function that is define in the /lib/api.js to make the api call
    onSuccess : () => {
      toast.success("Profile onboarded successfully");  // show the notification message using the pop-up
      queryClient.invalidateQueries({queryKey : ["authUser"]}); // re-fetch the userData when the onboarding is successfull
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  })

  // when the user click the Submit button we come here
  const handleSubmit = (e) =>  {
    e.preventDefault();
    onboardingMutation(formState);
  }

  // generate the random avatar url of the images
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 200) + 1; // 1-100 included
    const randomAvatar =`https://api.dicebear.com/7.x/adventurer/svg?seed=${idx}`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  // ========================================  Main UI code is started from here  =============================================//

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          {/*--------------------------------- Form is started from here  --------------------------------*/}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/*-------------- PROFILE PIC CONTAINER -----------------*/}
            <div className="flex flex-col items-center justify-center space-y-4">

              {/*---------- IMAGE PREVIEW ----------*/}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/*----------- Generate Random Avatar BTN -----------*/}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/*---------- FULL NAME ------------*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/*-------------- BIO ----------------*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/*---------------- LANGUAGE -----------------*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/*------- NATIVE LANGUAGE --------*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/*-------- LEARNING LANGUAGE ---------*/}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/*--------------------- LOCATION -----------------------*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/*---------------------- SUBMIT BUTTON ------------------------*/}

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;