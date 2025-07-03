app.factory('AuthService', function($http) {
    const baseUrl = 'http://94.74.86.174:8080/api';

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        console.log('AuthService: Token dikirim:', token);
        let headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        return headers;
    }

    return {
        login: function(data) {
            return $http.post(`${baseUrl}/login`, data);
        },
        register: function(data) {
            return $http.post(`${baseUrl}/register`, data);
        },
        getAllChecklists: function() {
            return $http({
                method: 'GET',
                url: `${baseUrl}/checklist`,
                headers: getAuthHeaders()
            });
        },
        createChecklist: function(data) {
            return $http({
                method: 'POST',
                url: `${baseUrl}/checklist`,
                data: data,
                headers: getAuthHeaders()
            });
        },
        deleteChecklist: function(id) {
            return $http({
                method: 'DELETE',
                url: `${baseUrl}/checklist/${id}`,
                headers: getAuthHeaders()
            });
        }
    };
});
