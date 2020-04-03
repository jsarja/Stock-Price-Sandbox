import UserProfile from './views/UserProfile';
import ChartDaily from './views/ChartDaily';
import ChartLongterm from './views/ChartLongterm';
import SignIn from './views/auth/SignIn';
import SignUp from './views/auth/SignUp';

const routes = [
	{
		path: "/profile",
		title: "Profile",
		component: UserProfile,
		header: "USER"
	},
	{
		path: "/stock-charts/daily",
		title: "Latest Daily",
		component: ChartDaily,
		header: "STOCK CHARTS"
	},
	{
		path: "/stock-charts/long-term",
		title: "Long-term",
		component: ChartLongterm,
	},
	{
		path: "/sign-in",
		title: "Sign In",
		component: SignIn,
	},
	{
		path: "/sign-up",
		title: "Sign Un",
		component: SignUp,
	},
];

  export default routes;
  