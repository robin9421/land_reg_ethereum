/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [{
        path: '/dashboard',
        // Relative to /src/views
        view: 'Dashboard'
    },
    {
        path: '/add-users',
        name: 'AddNewUsers',
        view: 'AddNewUsers'
    },
    {
        path: '/login',
        name: 'Login',
        view: 'Login'
    },
    {
        path: '/info/:data',
        name: 'Info',
        view: 'Info'
    },
    {
        path: '/partSell/:data',
        name: 'PartLandSell',
        view: 'PartLandSell'
    },
    {
        path: '/user-profile',
        name: 'User Profile',
        view: 'UserProfile'
    },
    {
        path: '/sell-requests',
        name: 'Sell Requests',
        view: 'SellRequests'
    },
    {
        path: '/sell-request-info/:name',
        name: 'Sell Request Info',
        view: 'SellRequestInfo'
    },
    {
        path: '/users-list',
        name: 'Users List',
        view: 'UserList'
    },
    {
        path: '/typography',
        view: 'Typography'
    },
    {
        path: '/icons',
        view: 'Icons'
    },
    {
        path: '/maps',
        view: 'Maps'
    },
    {
        path: '/notifications',
        view: 'Notifications'
    },
    {
        path: '/upgrade',
        name: 'Upgrade to PRO',
        view: 'Upgrade'
    }

]