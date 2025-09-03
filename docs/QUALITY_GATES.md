# Quality Gates & Mutation Testing

This document describes the quality gates system and mutation testing implementation for Phase 4 of the project.

## Overview

The quality gates system ensures that all code changes meet minimum quality standards before they can be merged. This includes:

- **Test Coverage**: Minimum thresholds for different code areas
- **Mutation Testing**: Ensures test quality by introducing code mutations
- **CI/CD Integration**: Automated quality checks in pull requests
- **Status Checks**: Required passing of all quality gates

## Quality Gate Requirements

### Coverage Thresholds

| Area             | Branches | Functions | Lines | Statements |
| ---------------- | -------- | --------- | ----- | ---------- |
| Global           | 35%      | 35%       | 35%   | 35%        |
| `src/lib/**`     | 70%      | 70%       | 70%   | 70%        |
| `src/app/api/**` | 55%      | 55%       | 55%   | 55%        |

### Mutation Testing Thresholds

- **High**: 80%+ (Excellent)
- **Low**: 60%+ (Good)
- **Break**: 50%+ (Minimum required for lib files)

## Mutation Testing

### What is Mutation Testing?

Mutation testing introduces small changes (mutations) to your source code and verifies that your tests can detect these changes. This ensures that your tests are actually testing the logic, not just covering lines.

### Running Mutation Tests

#### Local Development

```bash
# Run mutation tests once
npm run test:mutation

# Run mutation tests in watch mode
npm run test:mutation:watch

# Run mutation tests for CI
npm run test:mutation:ci
```

#### CI/CD

- **Automatic**: Add `run-mutation-tests` label to PR
- **Scheduled**: Runs nightly at 2 AM UTC
- **Manual**: Trigger via workflow dispatch

### Mutation Test Configuration

The Stryker configuration (`stryker.conf.json`) targets:

- **Scope**: `src/lib/**/*.ts` (core library files)
- **Exclusions**: Test files and test directories
- **Runner**: Jest with TypeScript support
- **Coverage Analysis**: Per-test analysis

## CI/CD Pipeline

### Job Structure

1. **Unit Tests** (`unit-tests`)
   - Runs unit tests for `src/lib/__tests__`
   - Uploads coverage to Codecov

2. **Integration Tests** (`integration-tests`)
   - Runs integration tests
   - Uploads coverage to Codecov

3. **E2E Tests** (`e2e-tests`)
   - Runs end-to-end tests
   - Uploads coverage to Codecov

4. **Mutation Tests** (`mutation-tests`)
   - Runs on schedule or label trigger
   - Uploads results as artifacts

5. **Quality Gates** (`quality-gates`)
   - Aggregates results from test jobs
   - Enforces coverage thresholds
   - Must pass for build to proceed

6. **Build** (`build`)
   - Compiles TypeScript
   - Runs linting and type checking
   - Uploads build artifacts

7. **Security** (`security`)
   - Runs npm audit
   - Checks for security vulnerabilities

### Status Checks

All jobs must pass for a PR to be mergeable:

- ✅ `unit-tests`
- ✅ `integration-tests`
- ✅ `e2e-tests`
- ✅ `quality-gates`
- ✅ `build`
- ✅ `security`

## Codecov Integration

### Coverage Reporting

- **Unit Tests**: Flagged as `unit`
- **Integration Tests**: Flagged as `integration`
- **E2E Tests**: Flagged as `e2e`

### Status Checks

- **Project Coverage**: 70% target with 5% threshold
- **Patch Coverage**: 70% target with 5% threshold
- **CI Integration**: Requires CI to pass before reporting

## Branch Protection

### Main Branch Requirements

- All status checks must pass
- At least 1 approving review
- Conversation resolution required
- No force pushes allowed

### Quality Gate Enforcement

- Coverage thresholds enforced
- Mutation test thresholds enforced
- All test suites must pass
- Security audit must pass

## Troubleshooting

### Common Issues

#### Coverage Below Threshold

1. Add more test cases
2. Remove unused code
3. Check exclusion patterns in Jest config

#### Mutation Score Too Low

1. Review test assertions
2. Add edge case tests
3. Ensure all code paths are tested
4. Check for overly complex logic

#### CI Job Failures

1. Check job logs for specific errors
2. Verify local test execution
3. Check for environment differences
4. Review dependency versions

### Getting Help

1. Check the [Troubleshooting Guide](../TROUBLESHOOTING.md)
2. Review CI job logs
3. Run tests locally with `npm run test:ci`
4. Check mutation test results locally

## Best Practices

### Writing Testable Code

- Keep functions small and focused
- Minimize side effects
- Use dependency injection
- Avoid complex conditional logic

### Test Coverage

- Test happy path scenarios
- Test error conditions
- Test edge cases
- Test boundary conditions

### Mutation Testing

- Run mutation tests before committing
- Review killed vs. survived mutations
- Add tests for survived mutations
- Focus on business logic areas

## Configuration Files

- `stryker.conf.json` - Mutation testing configuration
- `codecov.yml` - Coverage reporting configuration
- `.github/workflows/ci-quality-gates.yml` - Main CI pipeline
- `.github/workflows/nightly-mutation-tests.yml` - Scheduled mutation tests
- `.github/branch-protection-quality-gates.json` - Branch protection rules
- `.github/pull_request_template.md` - PR template with quality gates

## Metrics and Monitoring

### Key Metrics

- **Coverage Percentage**: Overall and per-area coverage
- **Mutation Score**: Quality of test suite
- **Test Execution Time**: Performance monitoring
- **CI Success Rate**: Pipeline reliability

### Dashboards

- **Codecov**: Coverage trends and reports
- **GitHub Actions**: CI/CD pipeline status
- **Stryker Dashboard**: Mutation test results (if configured)

## Future Enhancements

- **Dynamic Thresholds**: Adjust based on code complexity
- **Performance Testing**: Add performance regression tests
- **Security Scanning**: Enhanced security analysis
- **Dependency Monitoring**: Automated dependency updates
- **Code Quality Metrics**: SonarQube integration
