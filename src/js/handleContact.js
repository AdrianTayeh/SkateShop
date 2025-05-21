const form = document.querySelector(".contact-form");


export async function getContact() {
    const response = await fetch("http://localhost:3000/getcontact");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data;
}



async function postContactForm(contactinfo) {
    const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contactinfo),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);  
    const contactinfo = Object.fromEntries(formData.entries());
    await postContactForm(contactinfo);

})