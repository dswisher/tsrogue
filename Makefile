
BIN := node_modules/.bin
WEBPACK := $(BIN)/webpack

TS_SRC := $(shell find src -name '*.ts')
DIST := ./dist/tsrogue.js
DEPS := webpack.config.js tsconfig.json

all: $(DIST)

$(DIST): $(TS_SRC) $(DEPS)
	$(WEBPACK) -p

watch: clean $(DIST)
	$(WEBPACK) --watch

clean:
	rm -rf dist

.PHONY: clean

