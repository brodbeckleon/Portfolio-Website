package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const defaultFolder = "./error"

func SlidesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Otherwise, get all images from a specific folder:
	folder := r.URL.Query().Get("folder")
	if folder == "" {
		log.Println("No folder specified, using default")
		folder = filepath.Join(ImagesFolder, defaultFolder)
	}

	folder = filepath.Join(ImagesFolder, folder)

	log.Println("Fetching slides from", folder)
	slides, err := fetchSlidesFromFolder(folder)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the list of image paths as JSON
	log.Println("Returning slides", slides)
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
	log.Println("Slides fetched", slides)
	return slides, nil
}

func ServeImage(w http.ResponseWriter, r *http.Request) {
	imageName := r.URL.Query().Get("image")
	log.Println("Serving image", imageName)

	imagePath := filepath.Join(ImagesFolder, imageName)

	// Check if file exists to avoid 404
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, imagePath)
	log.Println("Image Served", imagePath)
}
