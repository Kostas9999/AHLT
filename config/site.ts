export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "IPFS Gateway",
	
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Upload",
      href: "/upload",
    },
   
   
    {
      label: "About",
      href: "/#",
    }
	],
	navMenuItems: [
		
		{
			label: "Dashboard",
			href: "/#",
		},
	
	
		{
			label: "Upload",
			href: "/#",
		},
		
	
	],
	links: {
		
		docs: "http://ip-fs.cloud/",		
   
	},
};
