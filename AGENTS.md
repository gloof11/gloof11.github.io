# Agent Guidelines for gloof11.github.io

This document outlines the guidelines for agents operating within the gloof11.github.io repository.

## 1. Build, Lint, and Test Commands

This project is built using Hugo. The primary command for building the site is:

```bash
hugo
```

To generate the site for production, use:

```bash
hugo --production
```

There are no explicit linting commands configured in this repository. Code style adherence relies on manual convention and best practices.

Testing is primarily manual, involving previewing the site locally before deployment. To run a local development server with live reloading, use:

```bash
hugo server
```

There are no specific commands for running single tests, as this is not a code-heavy project with a traditional testing framework.

## 2. Code Style Guidelines

### General Principles

- **Readability:** Code should be clear, concise, and easy to understand.
- **Consistency:** Adhere to the existing patterns and conventions within the codebase.

### Imports

- Not applicable for this static site generator project, as it primarily deals with Markdown and configuration files.

### Formatting

- **Markdown:** Standard Markdown formatting should be used. Employ consistent heading levels, list styles, and paragraph spacing.
- **TOML (Configuration):** Follow TOML's official style guide for `hugo.toml` and other configuration files.
- **HTML/CSS:** Maintain consistent indentation (spaces preferred over tabs) and spacing.

### Types

- Not applicable in the traditional programming sense. Focus on correct data types in TOML configuration.

### Naming Conventions

- **Files and Directories:** Use kebab-case for filenames and directory names (e.g., `my-post.md`, `images/my-photo.jpg`).
- **Hugo Content:** Content files (`.md`) should be named descriptively.
- **Hugo Configuration:** Use descriptive keys in `hugo.toml`.

### Error Handling

- **Hugo Build:** Pay attention to any warnings or errors reported by the `hugo` command during build or serve operations. Address them promptly.
- **Content Errors:** Ensure all links, image paths, and references within Markdown content are correct to avoid broken pages.

### Other Guidelines

- **Comments:** Use comments sparingly in Markdown content to explain complex sections or non-obvious content.
- **Asset Management:** Organize assets (images, CSS, JS) logically within the `static` or `assets` directories.

## 3. Cursor and Copilot Rules

- **Cursor Rules:** No specific Cursor rules (`.cursor/rules/` or `.cursorrules`) were found in the repository.
- **Copilot Instructions:** No specific Copilot instructions (`.github/copilot-instructions.md`) were found in the repository.

## 4. Workflow Suggestions

- **Content Creation:** Write content in Markdown (`.md`) files within the `content` directory. Use front matter (TOML) for metadata like title, date, tags, and categories.
- **Configuration:** Modify `hugo.toml` for site-wide settings, themes, and configurations.
- **Theming:** Customizations to the theme can be made by modifying files within the `themes/nv-chad-theme` directory. However, be mindful that theme updates might overwrite custom changes if not managed carefully (e.g., by forking the theme or using Hugo's lookup order effectively).
