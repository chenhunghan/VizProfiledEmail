export function mainController($scope, $http) {
    $http({
        method: 'GET',
        url: '/json/user_shelly.json'
    }).then(function successCallback(response) {
        $scope.peer_list = response.data.peer_list.slice(1, 11)
        console.log(response.data.email)
        console.log(response.data.peer_list[1])
        console.log(response.data.peer_list[1].thread_list[5])
        console.log('organizations: ' + response.data.peer_list[1].thread_list[3].organizations)
        console.log('people: ' + response.data.peer_list[1].thread_list[3].people)
        console.log('skills: ' + response.data.peer_list[1].thread_list[3].skills)
        console.log('phrase_peer: ' + response.data.peer_list[1].thread_list[3].phrase_peer)
        console.log('phrase_user: ' + response.data.peer_list[1].thread_list[3].phrase_user)
        console.log('peer_response_times: ' + response.data.peer_list[1].thread_list[3].peer_response_times)
        console.log('user_response_times: ' + response.data.peer_list[1].thread_list[3].user_response_times)
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
}
