$(document).ready(() => {
  $(".contact-us-btn, .btn-close-custom").on('click', () => {
    $('.card-contact-container').toggleClass('hide')
  })
})

function showToast(message, type = null, durationSeg = 3.3) {
  const toast = $(".toast-custom");
  if (toast.hasClass("show")) toast.removeClass("show");
  toast.removeClass("error");
  toast.removeClass("success");

  $(".toast-custom .toast-body").text(message);

  toast.addClass(type);
  toast.addClass("show");
  setTimeout(() => {
    toast.removeClass("show");
  }, durationSeg * 1000);
}

async function handlerResponse(path, options) {
  try {
    const response = await fetch(path, options);
    const data = await response.json();
    return data;
  } catch (e) {
    return {
      status: 500,
      message: "Ocorreu um erro inesperado",
      data: null,
    };
  }
}

function navigation(path) {
  const splitedUrl = window.location.href.split("../index.html");
  const domain = splitedUrl[2];
  const change = $(".change-route");
  if (domain === "localhost") {
    change.attr("href", `http://${domain}/${splitedUrl[3]}${path}`);
  } else {
    change.attr("href", `https://${domain}${path}`);
  }

  document.querySelector(".change-route").click();
}

class InvasionAccount {
  constructor() {
    this.buttonForm =$("#auth-btn");
    this.loadingContainer = $(".step-loading-container");
    this.progressBar =  $(".step-loading-main-container .progress-bar");
  }
  
  setProgressBar(percent) {
    const trated = percent >= 99 ? 100 : percent.toFixed(0)
    this.progressBar.css('width', `${trated}%`)
    this.progressBar.text(trated+'%')
  }

  startOrStopLoading(method) {
    if(method === 'start') $(".step-loading-main-container").removeClass('hide')
    else $(".step-loading-main-container").addClass('hide')
    this.buttonForm.attr("data-loading", method === 'start' ? "true" : "false");
    this.setProgressBar(0);
    this.loadingContainer.empty();
  }

  async stepLoading(steps) {
    let result = Promise.resolve();
    let percentStep = 0;
    const slicePercent = 100 / steps.length;
    steps.forEach((step, index) => {
      result = result.then(async () => {
        const responseName = await step();
        this.loadingContainer.append(`<li data-index="${index}" >${responseName.msg}</li>`)
  
        const random = Math.floor(Math.random() * 10) + 1;
  
        if(random >= responseName.error) {
          $(`.step-loading-container li[data-index="${index}"]`).addClass('error')
          this.loadingContainer.append(`<li class="error" data-index="${index}e" >Error on: ${responseName.msg}</li>`)
          const responseName2 = await step();
          this.loadingContainer.append(`<li data-index="${index}a" >Trying again...</li>`)
          const accepted = await step();
          $(`.step-loading-container li[data-index="${index}a"]`).addClass('active').text(responseName2.msg)
          percentStep += 1;
          this.setProgressBar(percentStep * slicePercent)
          return accepted;
        } else {
          const accepted = await step();
          $(`.step-loading-container li[data-index="${index}"]`).addClass('active')
          percentStep += 1;
          this.setProgressBar(percentStep * slicePercent)
          return accepted;
        }
      });
    });
    return result;
  }

  addRedirectTimer(segs, redirect) {
    this.loadingContainer.append(`<li data-index="redirect" >Redirect in: ${segs} seconds</li>`)
  
    const redirectItem = $(`.step-loading-container li[data-index="redirect"]`);
  
    let index = 1;
    const interval = setInterval(() => {
      if(index === segs) {
        redirectItem.toggleClass('active');
        this.startOrStopLoading('stop');
        navigation(redirect)
        clearInterval(interval)
      };
      redirectItem.text(`Redirect in: ${segs - index} seconds`)
      index += 1
    }, 1000)
  }

  async start(steps, preStep, request, redirectConfig) {
    try {
      this.startOrStopLoading('start');
      if(request) {
        this.loadingContainer.append(`<li data-index="-1" >${preStep}</li>`)

        const response = await request;
        if(response.status !== 200) {
          showToast(response.message, 'error')
          this.startOrStopLoading('stop');
          return
        }
        $(`.step-loading-container li[data-index="-1"]`).addClass('active')
      }
      await this.stepLoading(steps);
      this.addRedirectTimer(redirectConfig.segs, redirectConfig.redirect)
    } catch(e) {
      console.log(e)
      this.startOrStopLoading('stop');
    }
  }

}

async function request(path, method, body) {
  try {
    const response = await fetch(path, {
      method: method || 'GET',
      body: body ? JSON.stringify(body) : undefined,
    })
    const parsed = await response.json();
    return { status: response.status, ...parsed };
  } catch(e) {
    console.log(e)
    return {message: 'Ocorreu um erro inesperado', status: 500}
  }
}

// function startStepLoadingLogin() {
//   const loadingMessages = [
//     {msg: "Connecting to server...", error: 4},
//     {msg: "Authenticating...", error: 8},
//     {msg: "Access granted. Initiating session...", error: 6},
//     {msg:"Session initiated. Preparing for redirection...",  error: 6},
//     {msg:"Finalizing connection...",  error: 6},
//     {msg:"Initializing server protocols...", error: 6},
//     {msg:"Loading user profile...",  error: 8}
//   ];

//   return stepLoading(loadingMessages.map((message) => {
//     return () => new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(message);
//       }, 1250);
//     });
//   }));
// }

// function startStepInvadeAccount() {
//   const loadingMessages = [
//     {msg: "Connecting to server...", error: 10},
//     {msg: "Authenticating SSH...", error: 10},
//     {msg: "SSH authentication successful. Establishing secure connection...", error: 10},
//     {msg: "Connected to server. Initiating reconnaissance...", error: 10},
//     {msg: "Analyzing target's activity...", error: 10},
//     {msg: "Collecting information from database...", error: 10},
//     {msg: "Database connection established. Extracting user data...", error: 10},
//     {msg: "Exploiting vulnerabilities in security measures...", error: 10},
//     {msg: "Gaining access to privileged accounts...", error: 10},
//     {msg: "Escalating privileges...", error: 10},
//     {msg: "Access granted to target's account. Retrieving sensitive information...", error: 10},
//     {msg: "Covering tracks and removing traces of intrusion...", error: 10},
//     {msg: "Transferring data to secure location...", error: 10},
//     {msg: "Successful invasion", error: 11}
//   ];

//   return stepLoading(loadingMessages.map((message) => {
//     return () => new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(message);
//       }, 400);
//     });
//   }));
// }

// const loadingMessages = [
//   'Connecting to Instagram server...',
//   'Simulating IP in the region of Barbacena...',
//   'Bypassing firewall...',
//   'Injecting SQL queries...',
//   'Fetching information from @claudio123...',
//   'Error 305, trying again...',
//   'Cracking password...',
//   'Authenticating as @claudio123...',
//   'Access granted, redirecting to the requested server...',
// ];

function startMatrixEffect() {
  var canvas = document.getElementById( 'canvas' ),
		ctx = canvas.getContext( '2d' ),
    canvas2 = document.getElementById( 'canvas2' ),
    ctx2 = canvas2.getContext( '2d' ),
		// full screen dimensions
		cw = 1920,
		ch = 700,
    charArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    maxCharCount = 100,
    fallingCharArr = [],
    fontSize = 10,
    maxColums = cw/(fontSize);
    canvas.width = canvas2.width = cw;
    canvas.height = canvas2.height = ch;


    function randomInt( min, max ) {
    	return Math.floor(Math.random() * ( max - min ) + min);
    }

    function randomFloat( min, max ) {
    	return Math.random() * ( max - min ) + min;
    }

    function Point(x,y)
    {
      this.x = x;
      this.y = y;
    }

    Point.prototype.draw = function(ctx){

      this.value = charArr[randomInt(0,charArr.length-1)].toUpperCase();
      this.speed = randomFloat(1,5);


      ctx2.fillStyle = "rgba(255,255,255,0.8)";
      ctx2.font = fontSize+"px san-serif";
      ctx2.fillText(this.value,this.x,this.y);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize+"px san-serif";
        ctx.fillText(this.value,this.x,this.y);



        this.y += this.speed;
        if(this.y > ch)
        {
          this.y = randomFloat(-100,0);
          this.speed = randomFloat(.1);
        }
    }

    for(var i = 0; i < maxColums ; i++) {
      fallingCharArr.push(new Point(i*fontSize,randomFloat(-500,0)));
    }


    var update = function()
    {

    ctx.fillStyle = "#1c1c1c15";
    ctx.fillRect(0,0,cw,ch);

    ctx2.clearRect(0,0,cw,ch);

      var i = fallingCharArr.length;

      while (i--) {
        fallingCharArr[i].draw(ctx);
        var v = fallingCharArr[i];
      }

      requestAnimationFrame(update);
    }

  update();
}