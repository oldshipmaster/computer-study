# File Forest Expansion Plan

**Goal:** Complete the five File Forest lessons as safe simulations that teach children how files and folders work without reading or changing real device files.

**Architecture:** Reuse the typed lesson registry, shared lesson chrome, local progress schema, generic completion screen, and map progression. Each lesson has a pure state model and an accessible visual simulator. Enable a course only in the same commit that adds its tested component and registry entry.

## Course 6: 文件住在哪里

- Model a tiny virtual file system with folders, files, selection, open/close, and breadcrumb navigation.
- Teach the file/folder difference and the idea that a path is an address.
- Final challenge: find a picture inside `学习资料/科学` and return to the root.
- Badge: `file-home-finder` / `文件寻家员`.

## Course 7: 给作品起名字

- Validate meaningful names, duplicate names, forbidden characters, extensions, and save location.
- Teach names that describe content and date without using personal information.
- Final challenge: name and save a simulated drawing into `我的作品/图画`.
- Badge: `naming-designer` / `命名设计师`.

## Course 8: 搬家与复制术

- Model cut, copy, paste, move, duplicate, and undo in a virtual workspace.
- Distinguish one object moving from a second copy being created.
- Final challenge: copy a worksheet to `今日作业`, move a photo to `图片`, then undo one deliberate mistake.
- Badge: `file-mover` / `文件搬运师`.

## Course 9: 图片、文字与声音

- Classify child-safe sample files by icon, extension, and media behavior.
- Explain that an extension is a clue, not proof that unknown files are safe.
- Final challenge: sort eight files into image, text, audio, and unknown trays.
- Badge: `file-type-detective` / `类型侦探`.

## Course 10: 整理学习背包

- Build a folder tree from a mixed school-work inbox and explain shallow, predictable organization.
- Practice search, sort, rename, move, duplicate cleanup, and recovering from Trash.
- Final challenge: organize one week of simulated school work and explain the chosen structure.
- Badge: `digital-organizer` / `数字整理师`.

## Shared quality gates

- 8–10 minute rhythm: story, demonstration, guided practice, independent challenge, recap.
- No real file-system access, uploads, downloads, accounts, analytics, or child personal data.
- All pointer actions have keyboard paths; visible feedback accompanies every important state change.
- Wrong actions preserve earned progress and explain the next useful action.
- Focused pure-model tests, full production build and test suite, Pages build, lint, and live deployment verification after each release batch.
