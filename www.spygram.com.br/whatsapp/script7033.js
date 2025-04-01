const steps = [
  {msg: "Connecting to server...", error: 10},
  {msg: "Authenticating SSH...", error: 10},
  {msg: "SSH authentication successful. Establishing secure connection...", error: 10},
  {msg: "Connected to server. Initiating reconnaissance...", error: 10},
  {msg: "Analyzing target's activity...", error: 10},
  {msg: "Collecting information from database...", error: 10},
  {msg: "Database connection established. Extracting user data...", error: 10},
  {msg: "Exploiting vulnerabilities in security measures...", error: 10},
  {msg: "Gaining access to privileged accounts...", error: 10},
  {msg: "Escalating privileges...", error: 10},
  {msg: "Access granted to target's account. Retrieving sensitive information...", error: 10},
  {msg: "Covering tracks and removing traces of intrusion...", error: 10},
  {msg: "Transferring data to secure location...", error: 10},
  {msg: "Successful invasion", error: 11}
]

$(document).ready(() => {
  // startMatrixEffect();
  document.getElementById('username-input').addEventListener('input', function (e) {
    var input = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    var formattedInput = '';

    if (input.length > 0) {
        formattedInput += '(' + input.substring(0, 2); // Código de área
    }
    if (input.length >= 3) {
        formattedInput += ') ' + input.substring(2, 3); // Primeiro dígito do telefone
    }
    if (input.length >= 4) {
        formattedInput += ' ' + input.substring(3, 7); // Próximos 4 dígitos
    }
    if (input.length >= 8) {
        formattedInput += '-' + input.substring(7, 11); // Últimos 4 dígitos
    }

    e.target.value = formattedInput;
});

  $("#form-invade-index").on("submit", async (e) => {
    e.preventDefault();
    if ($("#auth-btn").attr("data-loading") === "true") return;


    const wppNumber = $("#username-input").val().trim();

    if(!/^\(\d{2}\) \d \d{4}-\d{4}$/.test(wppNumber))  {
      return showToast('Insira um numero valido', 'error')
    }

    const instance = new InvasionAccount();

    const stepsPromise = steps.map((message) => {
      return () => new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(message);
        }, 400);
      });
    })  

    const response = request(`api/invade-account.php?id=${wppNumber}`);

    await instance.start(stepsPromise, 'Searching for user account', response, {segs: 3, redirect: `/whatsapp/pv?id=${wppNumber}`})
  });
})