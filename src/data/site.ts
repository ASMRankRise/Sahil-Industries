export type NavigationItem = {
  label: string;
  href: string;
  children?: NavigationItem[];
};

export const primaryNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Products', href: '/products/single-girder-eot-crane', children: [
      { label: 'Single Girder EOT Crane', href: '/products/single-girder-eot-crane' },
      { label: 'Double Girder EOT Crane', href: '/products/double-girder-eot-crane' },
      { label: 'Electric Wire Rope Hoist', href: '/products/electric-wire-rope-hoist' },
      { label: 'Underslung Cranes', href: '/products/underslung-cranes' },
      { label: 'Goliath / Semi Goliath Crane', href: '/products/goliath-semi-goliath-crane' },
      { label: 'JIB Crane', href: '/products/jib-crane' },
      { label: 'Monorail Crane', href: '/products/monorail-crane' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Clients', href: '/clients' },
  { label: 'Career', href: '/career' },
  { label: 'Enquiry', href: '/enquiry' },
  { label: 'Contact', href: '/contact' },
  { label: 'Admin', href: '/admin' },
];

export const siteContact = {
  phone: '+91 96 2324 2324',
  phoneHref: 'tel:+919623242324',
  email: 'sahilcranes@gmail.com',
  address: 'Plot No. B 88, 89, 90 Kagal Hatkanagale Five Star MIDC, Village – Halsawade, Tal.- Karveer, Dist.- Kolhapur - 416 236.',
  hours: ['Tuesday - Sunday : 09:00 AM - 05:30 PM', 'Monday - Closed'],
} as const;
