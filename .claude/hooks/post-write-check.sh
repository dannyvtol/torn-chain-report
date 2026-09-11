#!/bin/bash
# Run lint, test, and format-check in parallel after any turn that modified a .js file.
# Exits non-zero (blocking Claude Code) if any command fails.

git status --porcelain | grep -q '\.js$' || exit 0

just lint & pid_lint=$!
just test & pid_test=$!
just format-check & pid_format=$!

wait $pid_lint;   status_lint=$?
wait $pid_test;   status_test=$?
wait $pid_format; status_format=$?

[ $status_lint -eq 0 ] && [ $status_test -eq 0 ] && [ $status_format -eq 0 ]
