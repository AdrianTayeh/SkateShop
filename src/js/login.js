async function validateUser(username, password) {
    try{
    const res = await fetch('http://localhost:3000/users');
    const users = await res.json();
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        console.log('Invalid username or password');
        return null;
    }
    return user;}
    catch (error) {
        console.error('Error validating user:', error);
        return null;
    }
}

const loginForm  = document.querySelector('#loginForm');
const errorMsg = document.querySelector('#errorMessage');

loginForm.addEventListener('submit', async (e) => {
e.preventDefault();
const formData = new FormData(loginForm);
const username = formData.get('username');
const password = formData.get('password');
const result = await validateUser(username, password)
if(!result){
    errorMsg.innerHTML = 'Invalid username or password';
    loginForm.reset();
    return;
    
}
if(result.role == "admin"){
    window.location.href = '/admin.html';
}
else{
    errorMsg.innerHTML = 'You do not have admin access';
    loginForm.reset();
    return;
}

})