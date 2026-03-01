// Post-build script: Generates route-specific HTML files with correct SEO tags
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const BASE_URL = 'https://www.busarrivaltimes.com';

const routes = [
    {
        path: '/',
        title: 'Singapore Bus Arrival Time | Real-time Next Bus Arrival Timings',
        description: 'Get real-time bus arrival times for Singapore bus stops. Track your favorite stops, find nearby buses, and plan your journey efficiently.',
        h1: 'Singapore Bus Arrival Times — Real-time Next Bus Timings',
    },
    {
        path: '/about',
        title: 'About Us - Bus Arrival Times Singapore',
        description: "Learn about Bus Arrival Times - Singapore's most reliable real-time bus tracking service.",
        h1: 'About Bus Arrival Times Singapore',
    },
    {
        path: '/contact',
        title: 'Contact Us - Bus Arrival Times Singapore',
        description: "Get in touch with Bus Arrival Times. We're here to help with any questions or feedback about Singapore bus tracking.",
        h1: 'Contact Us',
    },
    {
        path: '/blog',
        title: 'Blog - Bus Arrival Times Singapore | Tips & Updates',
        description: 'Read the latest blog posts about Singapore public transport, bus routes, and commuting tips.',
        h1: 'Blog',
    },
    {
        path: '/alarms',
        title: 'Bus Alarms - Set Bus Arrival Notifications | Bus Arrival Times SG',
        description: 'Set up bus arrival alarms and get notified when your bus is arriving. Never miss your bus in Singapore.',
        h1: 'My Alarms',
    },
    {
        path: '/privacy',
        title: 'Privacy Policy - Bus Arrival Times Singapore',
        description: 'Read our privacy policy to understand how Bus Arrival Times collects, uses, and protects your personal information.',
        h1: 'Privacy Policy',
    },
    {
        path: '/terms',
        title: 'Terms & Conditions - Bus Arrival Times Singapore',
        description: 'Read the terms and conditions for using Bus Arrival Times service.',
        h1: 'Terms & Conditions',
    },
];

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/alarms', label: 'Alarms' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
];

function generateNavHtml() {
    const links = navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join(' | ');
    return `<nav style="position:absolute;left:-9999px;top:-9999px;" aria-hidden="true">${links}</nav>`;
}

function processRoute(route, templateHtml) {
    let html = templateHtml;
    const canonicalUrl = BASE_URL + (route.path === '/' ? '/' : route.path);

    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);
    html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description" content="${route.description}" />`);
    html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${route.title}" />`);
    html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${route.description}" />`);
    html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`);
    html = html.replace(/<meta name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${route.description}" />`);

    const seoContent = `<h1 style="position:absolute;left:-9999px;top:-9999px;">${route.h1}</h1>${generateNavHtml()}`;
    html = html.replace('<div id="root"></div>', `<div id="root">${seoContent}</div>`);

    return html;
}

try {
    const indexPath = join(distDir, 'index.html');

    if (!existsSync(indexPath)) {
        console.log('dist/index.html not found. Run vite build first.');
        process.exit(1);
    }

    const templateHtml = readFileSync(indexPath, 'utf-8');
    console.log('Pre-rendering SEO pages...');

    for (const route of routes) {
        const html = processRoute(route, templateHtml);

        if (route.path === '/') {
            writeFileSync(indexPath, html, 'utf-8');
        } else {
            const routeDir = join(distDir, route.path);
            if (!existsSync(routeDir)) {
                mkdirSync(routeDir, { recursive: true });
            }
            writeFileSync(join(routeDir, 'index.html'), html, 'utf-8');
        }
        console.log('  OK: ' + route.path);
    }

    console.log('Done! Pre-rendered ' + routes.length + ' pages.');
} catch (err) {
    console.error('Pre-render error:', err.message);
    process.exit(1);
}
