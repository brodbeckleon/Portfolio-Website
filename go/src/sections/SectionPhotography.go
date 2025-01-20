package main

import (
	"encoding/json"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/api/slides", func(w http.ResponseWriter, r *http.Request) {
		directoryPath := "./../../../my-react-app/public/images/photography-portfolio"
		files, err := os.ReadDir(directoryPath)
		if err != nil {
			http.Error(w, "Unable to scan directory", http.StatusInternalServerError)
			return
		}

		var slides []string
		for _, file := range files {
			if !file.IsDir() {
				slides = append(slides, "./images/photography-portfolio/"+file.Name())
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(slides)
	})

	http.ListenAndServe(":3000", nil)
}
