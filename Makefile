
BIN := node_modules/.bin
WEBPACK := $(BIN)/webpack
WEBPACK_DEV := $(BIN)/webpack-dev-server

TS_SRC := $(shell find src -name '*.ts')
DIST := ./dist/tsrogue.js ./dist/index.html
DEPS := webpack.config.js tsconfig.json

all: $(DIST)

$(DIST): $(TS_SRC) $(DEPS) index.html
	$(WEBPACK) -p

serve: clean $(DIST)
	$(WEBPACK_DEV)

clean:
	rm -rf dist

.PHONY: clean serve 

