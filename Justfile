test:
    bun test

lint:
    bun lint

format:
    bun format

format-check:
    bun format-check

build:
    bun run build

check:
    just lint && just format-check && just test
