# Retrokroken Design Guidelines

## Brand Identity
- **Name**: Retrokroken (no space, lowercase)
- **Concept**: Vintage/retro collector's shop (70s, 80s, 90s items)
- **Tagline**: "Discover Retro Treasures — Make Your Offer"

## Design Style
- **Aesthetic**: Synthwave retro
- **Color Scheme**:
  - Primary Accent: Neon Magenta (#FF006E)
  - Secondary Accent: Neon Cyan (#00D9FF)
  - Background: Deep Purple (#0A0E27)
  - Cards/Content: White (#FFFFFF)
- **Tone**: Warm, inviting, nostalgic
- **Focus**: Product-centered (minimal design elements competing for attention)

## Core Features
1. **Hero Section**: Title "Retrokroken", subtitle "Discover Retro Treasures — Make Your Offer"
   - Scrolling marquee badge with matrix green text (#00FF00) in Audiowide font
   - Badge displays shipping/collection messaging (varies by language)
   - 10s animation with 25% translateX start position to minimize loop gap
2. **Product Gallery**: No prices displayed
3. **Bid System**: Each item has "Place a bid on this item" button
4. **Bid Form Modal**: Fields for bid amount, email, with confirmation message after submission
5. **Multi-Language**: Swedish, Norwegian, English with auto-detection (defaults to English for non-Nordic users)
6. **Footer**: Displays "Shipping worldwide from Norway or Sweden" in English on all language pages

## Technical Stack
- React + Tailwind CSS
- Responsive design (mobile-first)
- Smooth animations on scroll
- Language detection via browser settings

## Brand Voice
- Collector's mindset (not desperate to sell, items on owner's terms)
- Warm, genuine, retro-nostalgia vibes
- No corporate language
