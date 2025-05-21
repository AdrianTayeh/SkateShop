import { getContact } from "./handleContact";

const contactDiv = document.querySelector(".contactDiv");


async function renderConctact(){
const data = await getContact();
let cardNr = 0;
data.forEach((item) => {
    cardNr++
    const contactCard = document.createElement("div");
    contactCard.classList.add("contact-card");
    contactCard.innerHTML = `
    <p>Ärende: ${cardNr}</p>
        <h2>${item.name}</h2>
        <p>${item.email}</p>
        <p>${item.message}</p>
    `;
    contactDiv.append(contactCard);
});
}

renderConctact();
