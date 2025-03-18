import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthAdmin = () => {
  const [locked, setLocked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const padClicked = (e) => {
    e.preventDefault();
    setLocked(!locked);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!username || !password) {
      toast.error("Veuillez saisir un nom d'utilisateur et un mot de passe");
      return;
    }

    // Validate username format (exemple: minimum length, no special characters)
    if (username.length < 3) {
      toast.error("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    // Validate password complexity
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   toast.error(
    //     "Le mot de passe doit contenir au moins 8 caractères, avec des lettres et des chiffres"
    //   );
    //   return;
    // }

    setIsLoading(true);

    try {
      const response = await axios.get("http://127.0.0.1:3000/api/users", {
        params: {
          username,
          password,
        },
      });

      // Vérification explicite de l'authentification
      if (response.data && response.data.success === true) {
        // Stockage sécurisé du token
        localStorage.setItem("adminToken", response.data.token);
        sessionStorage.setItem("adminToken", response.data.token);

        toast.success("Connexion réussie !");

        setTimeout(() => {
          navigate("/admin/panel");
        }, 1500);
      } else {
        // Gestion précise des erreurs d'authentification
        toast.error(response.data.message || "Échec de l'authentification");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error(
        error.response?.data?.message ||
          "Échec de l'authentification. Vérifiez vos identifiants."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 justify-center font-parkinSans">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <p className="text-center bg-clip-text text-3xl bg-gradient-to-r from-green-300 to-orange-600 text-transparent">
        Connexion Admin
      </p>

      <img
        src="/admin.png"
        className="object-contain size-1/4 mx-auto"
        alt=""
      />

      <form onSubmit={handleLogin}>
        <div className="flex justify-center items-center bg-white max-w-xs mx-auto rounded-full h-12">
          <img src="/user.png" className="object-contain size-6 mr-2" alt="" />
          <div className="border-l bg-transparent h-8 mr-3 "></div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block bg-transparent h-9 focus:outline-none focus:ring-orange-500"
            placeholder="NOM D'UTILISATEUR"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-center items-center bg-white max-w-xs mx-auto rounded-full h-12 mt-4">
          <button onClick={padClicked} type="button" disabled={isLoading}>
            {locked ? (
              <img src="/pad-2.png" className="size-6 mr-2" alt="" />
            ) : (
              <img src="/pad1.png" className="size-6 mr-2" alt="" />
            )}
          </button>
          <div className="border-l bg-transparent h-8 mr-3 "></div>
          <input
            type={locked ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block bg-transparent h-9 focus:outline-none rounded-full"
            placeholder="MOT DE PASSE"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={`
            flex justify-center max-w-64 mx-auto 
            text-xl text-white hover:text-opacity-50 
            bg-gradient-to-r from-orange-300 to-orange-600 
            rounded-full p-2 mt-5
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Connexion"}
        </button>
      </form>
    </div>
  );
};

export default AuthAdmin;
