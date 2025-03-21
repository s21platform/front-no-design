export const AppRoutes = {
	main: () => '/',
	profile: () => '/profile',
	newSociety: () => '/new-society',
	peerSearch: () => '/peer-search',
	societySearch: () => '/society-search',
	peer: () => '/peer/:uuid',
	society: (uuid?: string) => uuid ? `/society/${uuid}` : '/society/:uuid',
}
