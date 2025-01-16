import { jwtDecode } from 'jwt-decode';

export function isAdmin() {
    const token = localStorage.getItem('token');
   
    try {
        const decoded = jwtDecode(token);
        if (!decoded || !decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
            console.error('Token does not contain role information');
            return false;
        }
        return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin';
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
}