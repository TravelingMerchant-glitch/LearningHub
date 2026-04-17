# Contributing to LearningHub

Thank you for your interest in contributing! 🎉

## Getting started

1. **Fork** the repository and create a branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Follow the setup instructions in [README.md](./README.md).

3. Make your changes, keeping them focused and well-tested.

4. Ensure all checks pass:

   ```bash
   npm run lint
   npm test
   npm run build
   ```

5. Submit a **Pull Request** against `main` using the PR template.

## Code style

- TypeScript is used throughout — avoid `any` where possible.
- Tailwind CSS utility classes for styling.
- Keep components small and focused.
- Co-locate tests with or near the code they test.

## Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

feat(notes): add tag filtering
fix(api): handle missing note gracefully
docs(readme): update setup instructions
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## Reporting bugs

Use the [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) template.

## Suggesting features

Use the [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) template.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Questions?

Open an issue or start a Discussion in the repository.
