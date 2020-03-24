const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //emite message to server
  socket.emit("chatMessage", msg);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

const socket = io();

//message from server
socket.on("message", message => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//output message to dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
        ${message}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
