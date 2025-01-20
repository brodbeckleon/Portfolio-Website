package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/api/slides", func(w http.ResponseWriter, r *http.Request) {

		currentDir, err := os.Getwd()
		if err != nil {
			http.Error(w, "Unable to get current directory", http.StatusInternalServerError)
			return
		}
		fmt.Println("Current directory: ", currentDir)

		directoryPath := currentDir + "/../../../my-react-app/public/images/photography-portfolio"
		fmt.Println("Current directory: ", directoryPath)
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
