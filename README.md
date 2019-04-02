# logger

To create new release change version in package.json and create git tag

```
git tag -a v1.0.0 -m "Release commit."
git push origin v1.0.0
```

If you use logger.fatal it will send event to Sentry.
