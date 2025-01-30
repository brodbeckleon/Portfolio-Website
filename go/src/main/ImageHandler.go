package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const imagesFolder = "./../../../images"
const defaultFolder = "./error"

func slidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// If ?image=something is set, serve that image directly:
	if imageName := r.URL.Query().Get("image"); imageName != "" {
		fmt.Println("Serving image", imageName)
		serveImage(w, r, imageName)
		return
	}

	// Otherwise, get all images from a specific folder:
	folder := r.URL.Query().Get("folder")
	if folder == "" {
		fmt.Println("No folder specified, using default")
		folder = filepath.Join(imagesFolder, defaultFolder)
	}

	folder = filepath.Join(imagesFolder, folder)

	fmt.Println("Fetching slides from", folder)
	slides, err := fetchSlidesFromFolder(folder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the list of image paths as JSON
	fmt.Println("Returning slides", slides)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(slides)
}

func fetchSlidesFromFolder(folderPath string) ([]string, error) {
	var slides []string

	entries, err := os.ReadDir(folderPath)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			name := entry.Name()
			ext := strings.ToLower(filepath.Ext(name))
			// Consider .jpg, .jpeg, .png as images (extend if needed)
			if ext == ".jpg" || ext == ".jpeg" || ext == ".png" {
				slides = append(slides, name)
			}
		}
	}
	fmt.Println("Slides fetched", slides)
	return slides, nil
}

// serveImage uses http.ServeFile to directly send the file content to the client.
func serveImage(w http.ResponseWriter, r *http.Request, imageName string) {
	// If your images are in a specific folder, prepend that folder:
	imagePath := filepath.Join(imagesFolder, imageName)

	// Check if file exists to avoid 404
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Serve the actual file
	http.ServeFile(w, r, imagePath)
	fmt.Println("Image Served", imagePath)
}
