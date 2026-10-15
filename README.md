# UDP Consult

Static real estate website concept for Abuja, Nigeria, with sourced architectural photography, layered clouds, responsive layouts and scroll animation.

## Preview locally

Run `python -m http.server 4173` from this folder and open `http://localhost:4173/`. No installation or build step is required.

## Hosting

GitHub Pages publishes the `main` branch from the repository root. Assets use relative paths so the site works beneath `/udp/`.

## Project status

Client email, contact details and live enquiry delivery are pending. The enquiry form currently saves on the visitor's device and offers a download; it sends no email. Property photography illustrates design concepts rather than confirmed listings.

## Photography and logo


No AI-generated images are used. Architecture and clouds are real photographs from the following sources. They illustrate an architectural direction, not live property listings in Abuja.

- Terrace residence: [David Pickup / Pexels](https://www.pexels.com/photo/modern-luxury-villa-aerial-view-with-pool-28449020/)
- Courtyard residence: [Jonathan Borba / Pexels](https://www.pexels.com/photo/modern-luxury-home-with-glass-facade-and-pool-28586202/)
- Glass residence: [Expect Best / Pexels](https://www.pexels.com/photo/modern-building-against-sky-323780/)
- Interior: [Max Vakhtbovych / Pexels](https://www.pexels.com/photo/spacious-living-room-of-modern-house-7031618/)
- Clouds: [Aaron Boucicault / Unsplash](https://unsplash.com/it/foto/un-cielo-blu-con-nuvole-bianche-XxXMIhzNNEU)

The provided logo is preserved in `dist/assets/brand-original.jpeg`. `brand-transparent.png` retains its original green-and-gold artwork with the white background removed. Hand-traced building masks and a color-keyed cloud layer were prepared with Pillow and NumPy. The source processing is reproducible with `prepare_photographs.py`; source photos are retained in `asset-sources/`. This is photographic layering with CSS perspective and parallax, rather than a rotatable 3D mesh.

Pexels license: https://www.pexels.com/license/ . Unsplash license: https://unsplash.com/license . Photography credits are also accessible in the website footer. Font OFL notices are in `licenses/`; GSAP distributions retain license headers.


Additional photographs: Max Vakhtbovych (Pexels 7031595 and 8134821), Zumrad Normatova (Pexels 18688231), and Matheus Rocha (Pexels 2061982). The website photography dialog includes the source links.
