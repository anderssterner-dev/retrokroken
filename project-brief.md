# Retrokroken — Page Idea

## Concept
A personal selling page for retro/vintage items from the 70s, 80s, and 90s.
The owner is a collector who is not desperate to sell — items go on his terms only.

## Items
CDs, toys, games, books, comics — retro era 70s/80s/90s/2000s.

## No Prices
No prices are shown on any item. Instead, each item has a bid button.

## Bid Button
Under each item there is a button with text along the lines of:
"Place a bid on this item to see if it is accepted"

## Bid Form
Clicking the button opens a form with:
- A bid amount field
- An email field
- A small info text: if your bid is accepted you will be contacted at [email]. Remember to check your spam filter.
- A submit button

## After Submission
The form disappears and is replaced by a warm, feel-good confirmation message.
Subtle animation. Leaves the bidder with a good feeling.

## Design Style
Warm vintage. Retro 70s/80s feel.
- Font: **Press Start 2P** (retro pixel/arcade font)
- Item cards inspired by **VHS tape cover design** — bold graphics, color blocks, diagonal elements, VHS-era typography
- Each item has a **"Se objekt"** button (Swedish for "View item") styled in the VHS aesthetic

## Languages
Swedish (default), Norwegian, English.
Browser language is auto-detected and matched.

---

## Session Notes (April 7, 2026)

### What Worked
- Multi-language title fields (title_sv, title_no, title_en) in admin form with auto-population
- Edit functionality for existing items with image preservation
- Display of existing images when editing (shows current uploads before replacing)
- Language switcher on admin dashboard
- New "Cans/Burkar/Bokser" subcategory under Home & Stuff
- Audiowide font for KROKEN (inline style approach worked when Tailwind class didn't)
- Search normalization for accents/special characters (pokemon→Pokémon, oboy→O'boy)
- Fetching all language descriptions for comprehensive search
- Footer spacing on Objects and ObjectDetail pages (pb-96 mobile, pb-24 desktop)
- Square aspect ratio for product images (aspect-square → aspect-[4/5])

### Mistakes/Lessons
- Initial font implementation via Tailwind config didn't work—inline style solved it
- Badge swap to sign.png image worked but user preferred original badge back
- Database columns (title_sv, title_no, title_en) needed manual SQL creation
- Search wasn't including language descriptions until database query was updated
- IntersectionObserver missing 'search' dependency caused filtered items not to display

### Key Decisions
- Removed main "title" field, auto-populate from first available language title
- Used object-cover instead of object-contain for square image display
- Generous bottom padding on objects pages to prevent footer overlap with fixed buttons
