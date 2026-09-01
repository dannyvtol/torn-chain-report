test:
    bun vitest run

lint:
    bun eslint src

format:
    bun prettier --write src

build:
    bun vite build

check:
    just lint && bun prettier --check src && just test
