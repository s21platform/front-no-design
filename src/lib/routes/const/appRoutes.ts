export const AppRoutes = {
	main: () => '/',
	login: () => '/login',
	profile: () => '/profile',
	newSociety: () => '/new-society',
	peerSearch: () => '/peer-search',
	societySearch: () => '/society-search',
	peer: () => '/peer/:uuid',
	society: (uuid?: string) => uuid ? `/society/${uuid}` : '/society/:uuid',
	advertSearch: () => '/adverts',
	advert: (uuid?: string) => uuid ? `/advert/${uuid}` : '/advert/:uuid',
	materials: () => '/materials',
	createMaterial: () => '/create-material',
}
