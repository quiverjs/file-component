build: src
	babel src --out-dir out

test: build
	tape out/test

.PHONY: build test
