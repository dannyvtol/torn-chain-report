test:
    bun run test

lint:
    bun run lint

format:
    bun run format

format-check:
    bun run format-check

build:
    bun run build

check:
    just lint && just format-check && just test
