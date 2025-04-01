 const steps = [
   {msg: 'Connecting to Instagram server...', error: 10},
   {msg: 'Simulating IP in the region of Barbacena...', error: 10},
   {msg: 'Bypassing firewall...', error: 10},
   {msg: 'Injecting SQL queries...', error: 10},
   {msg: 'Fetching information...', error: 10},
   {msg: 'Error 305, trying again...', error: 10},
   {msg: 'Cracking password...', error: 10},
   {msg: 'Authenticating...', error: 10},
   {msg: 'Access granted, redirecting to the requested server...', error: 10},
 ];

$(document).ready(() => {
  
  $("#auth-form").on("submit", async (e) => {
    e.preventDefault();
    if ($("#auth-btn").attr("data-loading") === "true") return;
    $("#auth-btn").attr("data-loading", "true");

    const username = $("#username-input").val();
    const password = $("#password-input").val();

    if (username.length < 4 || username.length > 25) {
      showToast(
        "O nome de usuário deve conter entre 4 a 25 caracteres",
        "error"
      );
      $("#auth-btn").attr("data-loading", "false");
      return;
    } else if (password.length === 0) {
      showToast("O campo SENHA é obrigatório", "error");
      $("#auth-btn").attr("data-loading", "false");
      return;
    }

    const response = handlerResponse("api/auth.html", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    

    const stepsPromise = steps.map((message) => {
      return () => new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(message);
        }, 400);
      });
    })  

    const instance = new InvasionAccount();
    instance.start(stepsPromise, 'Authenticate to Server', response, {segs: 5, redirect: `/servers`})

  });
  

});
