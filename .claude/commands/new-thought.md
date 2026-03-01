Ask the user for:
1. **Title** — the post title
2. **Description** — a one-line summary for the list view

Then:
1. Generate a slug from the title (lowercase, spaces to hyphens, remove special chars)
2. Get today's date in YYYY-MM-DD format
3. Create a new markdown file at `thoughts/posts/<slug>.md` with the title as an h1 heading
4. Read `thoughts/posts.json`, add the new entry at the **top** of the array (newest first), and save it
5. Show the user the file path and slug so they can start writing
