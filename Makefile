CHROME_ZIP_FILE = opsle-chrome.zip
FIREFOX_ZIP_FILE = opsle-firefox.zip
SOURCE_FILES = background.js content.js
ICON_DIR = icons

.PHONY: all zip chrome firefox clean

all: zip

zip: chrome firefox

chrome: manifest.json $(SOURCE_FILES) $(ICON_DIR)
	@zip -r $(CHROME_ZIP_FILE) manifest.json $(SOURCE_FILES) $(ICON_DIR)

firefox: manifest.firefox.json $(SOURCE_FILES) $(ICON_DIR)
	@tmpdir="$$(mktemp -d)"; \
	cp manifest.firefox.json "$$tmpdir/manifest.json"; \
	cp background.js content.js "$$tmpdir"; \
	cp -r $(ICON_DIR) "$$tmpdir"; \
	(cd "$$tmpdir" && zip -r "$(PWD)/$(FIREFOX_ZIP_FILE)" manifest.json background.js content.js $(ICON_DIR)); \
	rm -rf "$$tmpdir"

clean:
	@rm -f $(CHROME_ZIP_FILE) $(FIREFOX_ZIP_FILE)
