# Fix Favorites to be Per-User (Not Global)

## Steps:

✅ 1. Update `ecommerce-frontend/lib/favorites.ts` - Make storage key user-specific using user_id from JWT token.

✅ 2. Update `ecommerce-frontend/app/favorites/page.tsx` - Use useFavorites hook instead of direct localStorage.

✅ 3. Update `ecommerce-frontend/app/product/[id]/page.tsx` - Use useFavorites hook instead of direct localStorage.

- [ ] 4. Test:
  * Login User1, add product → check localStorage key `favorites_USERID`.
  * Login User2 → different list.
  * Remove → only affects own.

**Changes complete! Run `cd ecommerce-frontend && npm run dev` to test.**



- [ ] 2. Update `ecommerce-frontend/app/favorites/page.tsx` - Use useFavorites hook instead of direct localStorage.
- [ ] 3. Update `ecommerce-frontend/app/product/[id]/page.tsx` - Use useFavorites hook instead of direct localStorage.
- [ ] 4. Test:
  * Login User1, add product → check localStorage.
  * Login User2 → different favorites.
  * Remove → only affects own.
- [ ] 5. Optional: Add favorite count to Navbar.

**Current Progress: Starting implementation**
