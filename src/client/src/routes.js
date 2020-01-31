import Dashboard from './views/Dashboard';
import ChartDaily from './views/ChartDaily';
import ChartLongterm from './views/ChartLongterm';

const routes = [
	{
		path: "/dashboard",
		title: "Dashboard",
		component: Dashboard,
		header: "START"
	},
	{
		path: "/stock-charts/daily",
		title: "Daily",
		component: ChartDaily,
		header: "STOCK CHARTS"
	},
	{
		path: "/stock-charts/long-term",
		title: "Long-term",
		component: ChartLongterm,
	}
];

  export default routes;
  