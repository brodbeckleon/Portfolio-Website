package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func main() {
	http.HandleFunc("/", switchHandler)
	fmt.Println("Server is running on http://localhost:3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func switchHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.ANSIC, r.URL.Path)
	switch {
	case strings.HasSuffix(r.URL.Path, ".tsx"):
		serveTypeScript(w, r, r.URL.Path)
	case r.URL.Path == "/api/slides":
		slidesHandler(w, r)
	case r.URL.Path == "/":
		fmt.Fprintf(w, "Welcome to the homepage!")
	case r.URL.Path == "/about":
		fmt.Fprintf(w, "Welcome to the about page!")
	default:
		http.Error(w, "404 Not Found", http.StatusNotFound)
	}
}

func serveTypeScript(w http.ResponseWriter, r *http.Request, tsxFileName string) {
	tsxFilePath := filepath.Join("front-end/src", tsxFileName)

	// Check if file exists to avoid 404
	if _, err := os.Stat(tsxFilePath); os.IsNotExist(err) {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	// Set the correct MIME type for TypeScript files
	w.Header().Set("Content-Type", "application/typescript")
	http.ServeFile(w, r, tsxFilePath)
}
