import { Button, Grid, GridItem, Image } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import supabase from "../supabaseClient";
import { useAppContext } from "../context/appContext";
import NameForm from "./NameForm";

export default function Header() {
  const { username, setUsername, randomUsername, session } = useAppContext();

  const handleGoogleLogin = async () => {
    try {
      // URL de redirección dinámica para producción/desarrollo
      const isProduction = window.location.hostname !== 'localhost';
      const redirectTo = isProduction 
        ? 'https://colabora-chat.vercel.app/'  // URL exacta de producción
        : 'http://localhost:5173/';            // URL exacta de desarrollo

      console.log('Redirecting to:', redirectTo);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Error logging in with Google:', error);
        alert('Error al iniciar sesión: ' + error.message);
        return;
      }
    } catch (error) {
      console.error('Exception during Google login:', error);
      alert('Error inesperado: ' + error.message);
    }
  };

  return (
    <Grid
      templateColumns="max-content 1fr min-content"
      justifyItems="center"
      alignItems="center"
      bg="#000000"
      position="sticky"
      top="0"
      zIndex="10"
      borderBottom="20px solid #edf2f7"
    >
      <GridItem justifySelf="start" m="2">
        <Image src="/logo512.png" height="30px" ml="2" />
        <text style={{ color: "white", marginLeft: "10px", fontWeight: "bold"}}>COLABORA CHAT</text>
      </GridItem>
      
      {session ? (
        <>
          <GridItem justifySelf="end" alignSelf="center" mr="4">
            Welcome <strong>{username}</strong>
          </GridItem>
          <Button
            marginRight="4"
            size="sm"
            variant="link"
            onClick={() => {
              const { error } = supabase.auth.signOut();
              if (error) return console.error("error signOut", error);
              const username = randomUsername();
              setUsername(username);
              localStorage.setItem("username", username);
            }}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <GridItem justifySelf="end" alignSelf="end">
            <NameForm username={username} setUsername={setUsername} />
          </GridItem>
          <Button
            size="sm"
            marginRight="2"
            colorScheme="red"
            variant="outline"
            onClick={handleGoogleLogin}
            color="red"
          >
            Login with Gmail <FaGoogle />
          </Button>
        </>
      )}
    </Grid>
  );
}