
export default function isLoggedIn() {
    const token = localStorage.getItem('auth_token'); 
    return token !== null;
}