import { Route, Routes,Navigate } from "react-router-dom";

// import thee pages to load
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"

// import the components 
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";

// for the notification pop-up
import toast, {Toaster} from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query"

// import the axiosInstance
import { axiosInstance } from "./lib/axios.js";

// import the hooks
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";

// ==================================================================================================================================//

const App = () => {

  // get the logged-in user's data and isLoading(i.e. query is still running or not)
  const {isLoading, authUser} = useAuthUser();

  const {theme} = useThemeStore(); 

  // check if the user is authenticated(logged-in) or not
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // if the isLoading is true means query is running (render the Loading)
  if(isLoading)
  {
    return <PageLoader />
  }  


  return (
      <div className='h-screen' data-theme={theme}>

        <Routes>

          // When request comming to "/" check --- If the user is authenticated and onBoarded, render "HomePage" else if it is authenticated only then navigate to "onBoarding" page else navigate to the "login" page
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <HomePage />  {/* wrap the "HomePage" inside the "Layout" and pass the "HomePage" as 'children' of the "Layout" */}
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          
          // When request comming to "/" check --- If the user is not Authenticated,render "SignupPage" else if its is Authenticated and onboarded navigate to the "HomePage"  else navigate to the "Onboarding page"
          <Route 
            path="/signup" 
            element = {
              !isAuthenticated ? <SignUpPage/> : <Navigate to={isOnboarded ? "/" : '/onboarding'}/>
            } 
          />

          // When request comming to "/login" check --- If the user is not Authenticated,render "LoginPage" else if its is Authenticated and onboarded navigate to the "HomePage"  else navigate to the "Onboarding page"
          <Route 
            path="/login" 
            element = {
              !isAuthenticated ? <LoginPage/> : <Navigate to={isOnboarded ? "/" : '/onboarding'}/>
            }
          />

          // When request comming to "/notifications" check -- If the user is Authenticated and onboarded then render "NotificationPage" else if it is authenticated goto "OnboardingPage" else navigate to the "loginPage"
          <Route
            path="/notifications"
            element = {
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <NotificationsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />

          // When request comming to "/call/:id" check --- If the user is Authenticated and onboarded then render "CallPage" else if user is authenticated only navigate to "OnboardingPage" else navigate to the "LoginPage"
          <Route 
            path="/call/:id" 
            element = {
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={false}>
                  <CallPage/>
                </Layout>  
              ) : (
                <Navigate to = {!isAuthenticated ? '/login' : "/onboarding"} />
              ) 
            }
          />

          // When request comming to "/chat/:id" check --- If the user is Authenticated and onboarded then render "ChatPage" else if user is authenticated only navigate to "OnboardingPage" else navigate to the "LoginPage"
          <Route 
            path="/chat/:id" 
            element = {
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={false}>
                  <ChatPage/>
                </Layout>  
              ) : (
                <Navigate to = {!isAuthenticated ? '/login' : "/onboarding"} />
              ) 
            }
          />

          // When request comming to "/onboarding" check ---  If the user is authenticated and onboarded render "HomePage" and if user is authenticated but not onboarded render "onboarding page" else navigate to the "Login page"
          <Route 
            path="/onboarding" 
            element = { 
              isAuthenticated ? (
                !isOnboarded ? ( <OnboardingPage/>) : (<Navigate to='/' />)
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>

        <Toaster/>
      </div>
  )
}

export default App 