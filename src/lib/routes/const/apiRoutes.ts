export const ApiRoutes = {
	profile: () => '/api/profile',
	society: () => '/api/society',
	search: () => '/api/search',
	peer: (id?: string) => `/api/peer/${id}`,
	friends: () => '/api/friends',
	friendsCount: () => '/api/friends/counts',
	checkFriendship: () => '/api/friends/check',
	notification: () => '/api/notification',
	notificationCount: () => '/api/notification/count',
	avatar: () => '/api/avatar',
	optionOs: () => 'api/option/os',

	checkAuth: () => '/auth/check-auth',
	login: () => '/auth/login',
}
