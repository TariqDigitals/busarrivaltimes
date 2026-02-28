import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
}

const BASE_URL = 'https://www.busarrivaltimes.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function useSEO({ title, description, canonical, ogImage }: SEOProps) {
    const location = useLocation();
    const fullCanonical = canonical || `${BASE_URL}${location.pathname}`;
    const fullOgImage = ogImage || DEFAULT_OG_IMAGE;

    useEffect(() => {
        // Title
        document.title = title;

        // Meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // Canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (canonicalLink) {
            canonicalLink.href = fullCanonical;
        } else {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            canonicalLink.href = fullCanonical;
            document.head.appendChild(canonicalLink);
        }

        // Open Graph tags
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', description);
        updateMetaTag('property', 'og:url', fullCanonical);
        updateMetaTag('property', 'og:image', fullOgImage);

        // Twitter tags
        updateMetaTag('name', 'twitter:title', title);
        updateMetaTag('name', 'twitter:description', description);
        updateMetaTag('name', 'twitter:image', fullOgImage);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [title, description, fullCanonical, fullOgImage]);
}

function updateMetaTag(attr: 'property' | 'name', key: string, value: string) {
    let tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement;
    if (tag) {
        tag.content = value;
    } else {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        tag.content = value;
        document.head.appendChild(tag);
    }
}
