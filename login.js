const BASE_URL = "https://ds-elp2-be.herokuapp.com/";

const form = document.getElementById("form");
const email = document.getElementById("email"); //email value odnośi się do tego selektora
const password = document.getElementById("password");

const remember = document.querySelector("#rememberCheckbox");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateLoginForm()) {
    const data = {
      email: email.value,
      password: password.value,
    };

    login(data);
  } else {
    console.log("nie ma requesta - błąd walidacji");
  }
});

function validateLoginForm() {
  let proceed = {
    email: true,
    password: true,
  };
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!emailRegex.test(email.value)) {
    email.classList.add("error");
    emailError.classList.add("visible");
    proceed.email = false;
  } else {
    email.classList.remove("error");
    emailError.classList.remove("visible");
    proceed.email = true;
  }
  if (!passwordRegex.test(password.value)) {
    password.classList.add("error");
    passwordError.classList.add("visible");
    proceed.password = false;
  } else {
    password.classList.remove("error");
    passwordError.classList.remove("visible");
    proceed.password = true;
  }

  function shuldProceed(proceed) {
    for (let key in proceed) {
      if (!proceed[key]) {
        return false;
      }
    }
    return true;
  }
  return shuldProceed(proceed); // kontekstem jest validateLoginForm()
}

async function login(data) {
  try {
    const response = await fetch(`${BASE_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result); //acces token
    if (result.message == "Unauthorized") {
      return;
    } else {
      if (remember.checked) {
        localStorage.setItem("remember_user", 1);
      } else {
        localStorage.setItem("remember_user", 0);
      }
      localStorage.setItem("access_token", result.access_token); // tu przechowujemy nasz token, klucz dostępu
      window.location.href ="/profile.html"
    }
  } catch (error) {
    console.error(error);
  }
}

