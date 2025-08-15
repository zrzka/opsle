ZIP_FILE = opsle.zip
SOURCE_FILES = manifest.json background.js content.js
ICON_DIR = icons

.PHONY: all zip clean

all: zip

zip: $(SOURCE_FILES) $(ICON_DIR)
	@zip -r $(ZIP_FILE) $(SOURCE_FILES) $(ICON_DIR)

clean:
	@rm -f $(ZIP_FILE)
