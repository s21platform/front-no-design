export const ApiRoutes = {
	profile: () => '/api/profile',
	society: () => '/api/society',
	societySearch: () => 'api/societies/search',
	search: () => '/api/search',
	peer: (id?: string) => `/api/peer/${id}`,
	friends: () => '/api/friends',
	friendsCount: () => '/api/friends/counts',
	checkFriendship: () => '/api/friends/check',
	notification: () => '/api/notification',
	notificationCount: () => '/api/notification/count',
	avatar: () => '/api/avatar/user',
	optionOs: () => '/api/option/os',
	advert: () => '/api/advert',

	checkAuth: () => '/auth/check-auth',
	login: () => '/auth/login',
	logout: () => '/auth/logout',
}
