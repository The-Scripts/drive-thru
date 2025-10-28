import { useEffect } from 'react';

export default function LoginPage() {
    useEffect(() => {
        // Load the Google Sign-In script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "596169846361-c9kd8cfrt5ch5sdbapjvtbnaeob6dgjt.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("buttonDiv"),
                { theme: "outline", size: "large" }
            );

            window.google.accounts.id.prompt();
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    function handleCredentialResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
    }

    return (
        <>
            <div id="buttonDiv"></div>
        </>
    );
}