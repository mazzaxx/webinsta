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
  $("#form-invade-index").on("submit", async (e) => {
    e.preventDefault();
    if ($("#auth-btn").attr("data-loading") === "true") return;


    const username = $("#username-input").val().trim();

    if(username[0] !== '@') return showToast('Coloque o @ antes do nome da conta', 'error')
    if(username.length < 5) return showToast('O nome da conta precisa ter no minimo 5 caracteres', 'error')
    if(username.length > 30) return showToast('O nome da conta é muito grande', 'error')

      
    const instance = new InvasionAccount();

    const stepsPromise = steps.map((message) => {
      return () => new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(message);
        }, 400);
      });
    })  

    const response = request(`api/invade-account.php?id=${username}`);

    await instance.start(stepsPromise, 'Searching for user account', response, {segs: 3, redirect: `/pv?id=${username}`})
  });
})