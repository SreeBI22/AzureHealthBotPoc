let start = 0;
let buttonClicked = false;
let b1 = false;
let end = false;
const sendMessage = () => {
  buttonClicked = true;
  fetchConditionally();
};

const endConversation = () => {
  end = true;
  fetchConditionally();
};

// Talk to agent
const agentBtn = document.getElementById("agent");
const agent = String.fromCodePoint(
  JSON.parse('"\\uD83D\\uDC69"').codePointAt(0)
);
agentBtn.innerHTML = agent;

// Reload bot
const reloadBtn = document.getElementById("reload");
const reload = String.fromCodePoint(JSON.parse('"\\u267B"').codePointAt(0));
reloadBtn.innerHTML = reload;

// End conversation
const endBtn = document.getElementById("end");
const endConvo = String.fromCodePoint(JSON.parse('"\\u274C"').codePointAt(0));
endBtn.innerHTML = endConvo;

const ques = {
  q1: "What is the size of the tablet?",
  q2: "Can Jardiance be used for weight loss?",
  q3: "What is Jardiance used for?",
  q4: "When was Jardiance first approved by the FDA?",
  q5: "How does Jardiance work for diabetes?",
  q6: "Describe eGFR 20 versus eGFR 30?",
};

let suggestedQues = "";

const callHandler = (id) => {
  b1 = true;
  suggestedQues = ques[id];
  fetchConditionally();
};

const styleOptions = {
  botAvatarInitials: "",
  accent: "#00809d",
  botAvatarBackgroundColor: "white",
  userAvatarBackgroundColor: "white",
  hideUploadButton: true,
  botAvatarImage:
    "https://omnichannelsolutions.blob.core.windows.net/ofev/bot-svgrepo-com.png",
  userAvatarImage:
    "https://omnichannelsolutions.blob.core.windows.net/ofev/userImage1.png",
  userAvatarInitials: "",
  backgroundColor: "#white",
  bubbleBackground: "#e5e5e5",
  bubbleFromUserBackground: "#3b82f6",
  bubbleFromUserTextColor: "white",
  bubbleBorderRadius: 10,
  bubbleFromUserBorderRadius: 10,
  suggestedActionBorderRadius: 10,
  suggestedActionBorderStyle: "solid",
  suggestedActionBorderWidth: 1,
  suggestedActionHeight: 24,
  suggestedActionLayout: "flow", // either "carousel" or "stacked" or "flow"
  timestampColor: "#000000",
  timestampFormat: "absolute timestamp",
  sendBoxTextColor: "#000000",
  suggestedActionBackgroundColorOnHover: "#6082B6",
  suggestedActionBackgroundColorOnActive: "#6082B6",
  suggestedActionBackgroundColor: "#36454F",
  suggestedActionTextColor: "#FFFFFF",
  suggestedActionBackgroundColorOnFocus: "#6082B6",
  suggestedActionBackgroundColorOnDisabled: "#6082B6",
  typingAnimationBackgroundImage:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAUACgDASIAAhEBAxEB/8QAGgABAQACAwAAAAAAAAAAAAAAAAYCBwMFCP/EACsQAAECBQIEBQUAAAAAAAAAAAECAwAEBQYRBxITIjFBMlFhccFScoGh8f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD0lctx023JVD9UeKOIcNoSNylkdcCMbauSmXHLOPUx8r4ZAcQtO1SM9Mj5iO1gtWo1syc7S2zMKYSptbIPNgnII8/5HBpRZ9RpaKjNVVCpUzLPAQ1nmA7qPl6fmAondRrcaqhkVTiiQrYXgglsH7vnpHc3DcNNoEimaqT4Q2s4bCRuUs+gEaLd05uNFVMmiS3o3YEwFDhlP1Z7e3WLzUuzahUKHRk0zM07TmeApvOFLGEjcM9+Xp6wFnbN0Uu5GnF0x4qW1je2tO1Sc9Djy9oRD6QWlU6PPzVSqjRlgtksttKPMcqBKiO3h/cIDacIQgEIQgEIQgP/2Q==",
  typingAnimationDuration: 100000,
  typingAnimationHeight: 200,
  typingAnimationWidth: 640,
  timestampColor: "grey",
};

/**
 * HANDLE CONVERSATION TOKEN
 */
const TTL = 3600 * 1000; // 1 hour expiration duration in milliseconds
let convoInfo;

const isCookieEnabled = () => {
  const cookieIsEnabled = navigator.cookieEnabled;
  return cookieIsEnabled;
};

const setToken = (key, value, id, ttl) => {
  const now = new Date();
  const item = {
    value, //convo token
    id, // convo id
    expires_in: now.getTime() + ttl, // expiration duration
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getToken = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expires_in) {
    localStorage.removeItem(key);
    return null;
  }
  return item;
};

const resetTTL = (item) => {
  const now = new Date();
  let { value, id, expires_in } = item;
  expires_in = now.getTime() + TTL;
  const newItem = { value, id, expires_in };
  localStorage.setItem("conversationHistory", JSON.stringify(newItem));
};

// Add your BOT ID below
// var BOT_ID = "001efe66-e081-41cd-8e74-75b8149ea945";
let messageSent = "";
// var theURL =
//   "https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=" +
//   BOT_ID;
let myHeaders = new Headers();
myHeaders.append(
  "Authorization",
  "Bearer UASecm2JzEs.uaE4Q-MZ8U6y4bzH8p-iEkJyIukRVSCc2D_icZJgZv4"
);
const theURL =
  "https://europe.directline.botframework.com/v3/directline/tokens/generate";
const config = {
  method: "POST",
  headers: myHeaders,
};

const store = window.WebChat.createStore(
  {},
  ({ dispatch }) =>
    (next) =>
    (action) => {
      if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
        resetTTL(getToken("conversationHistory"));
        if (action.payload.activity.type === "message") {
          let typingIndicator = document.getElementById("loading-bar");
          if (messageSent === action.payload.activity.text)
            typingIndicator.classList.add("loading-bar-initial");
          else typingIndicator.classList.remove("loading-bar-initial");
        }
      }
      if (action.type === "DIRECT_LINE/POST_ACTIVITY") {
        if (action.payload.activity.type === "message") {
          messageSent = action.payload.activity.text;
          let typingIndicator = document.getElementById("loading-bar");
          typingIndicator.classList.add("loading-bar-initial");
        }
      }
      if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
        if (start === 0) {
          dispatch({
            meta: {
              method: "keyboard",
            },
            payload: {
              activity: {
                channelData: {
                  postBack: true,
                },
                name: "startConversation",
                type: "message",
                text: "hello",
              },
            },
            type: "DIRECT_LINE/POST_ACTIVITY",
          });
          start = 1;
        } else if (start !== 0 && buttonClicked === true) {
          dispatch({
            meta: {
              method: "keyboard",
            },
            payload: {
              activity: {
                name: "connectAgent",
                type: "message",
                text: "Connect to an agent",
              },
            },
            type: "DIRECT_LINE/POST_ACTIVITY",
          });
          start = 1;
          buttonClicked = false;
        } else if (start !== 0 && end === true) {
          dispatch({
            meta: {
              method: "keyboard",
            },
            payload: {
              activity: {
                name: "endConvo",
                type: "message",
                text: "End conversation",
              },
            },
            type: "DIRECT_LINE/POST_ACTIVITY",
          });
          start = 1;
          end = false;
        } else if (b1 || b2 || b3 || b4 || b5 || b6) {
          dispatch({
            meta: {
              method: "keyboard",
            },
            payload: {
              activity: {
                name: "suggestedQues",
                type: "message",
                text: suggestedQues,
              },
            },
            type: "DIRECT_LINE/POST_ACTIVITY",
          });
          start = 1;
          b1 = b2 = b3 = b4 = b5 = b6 = false;
        } else {
          dispatch({
            meta: {
              method: "keyboard",
            },
            payload: {
              activity: {
                channelData: {
                  postBack: true,
                },
                name: "startConversation",
                type: "event",
              },
            },
            type: "DIRECT_LINE/POST_ACTIVITY",
          });
          start = 1;
        }
      }
      return next(action);
    }
);

const preserveConversation = (conversationInfo) => {
  let token = "";
  let id = "";
  if (getToken("conversationHistory") === null) {
    token = conversationInfo.token;
    id = conversationInfo.conversationId;
    const expirationDuration = conversationInfo.expires_in * 1000;
    setToken("conversationHistory", token, id, expirationDuration);
  }
  let item = getToken("conversationHistory");
  token = item.value.toString();
  id = item.id.toString();
  if (token === null || id === null) {
    token = conversationInfo.token;
    id = conversationInfo.conversationId;
  }
  window.WebChat.renderWebChat(
    {
      directLine: window.WebChat.createDirectLine({
        token,
        id,
        domain: "https://europe.directline.botframework.com/v3/directline",
      }),
      store: store,
      styleOptions: styleOptions,
    },
    document.getElementById("webchat")
  );
};

const fetchFromDirectLine = () => {
  fetch(theURL, config)
    .then((response) => response.json())
    .then((conversationInfo) => {
      console.log(conversationInfo);
      convoInfo = conversationInfo;
      preserveConversation(conversationInfo);
    })
    .catch((err) => console.log("An error occurred: " + err));
};
const fetchConditionally = () => {
  if (!isCookieEnabled() || getToken("conversationHistory") === null)
    fetchFromDirectLine();
  else preserveConversation(convoInfo);
};

fetchConditionally();

const reloadBot = () => {
  localStorage.removeItem("conversationHistory"); // "conversationHistory" is the key for the item in the local storage
  window.location.reload();
};
