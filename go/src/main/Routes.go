package main

import (
	"go.mod/src/main/handlers"
	"net/http"
	"os"
	"path/filepath"
)

func registerRoutes(mux *http.ServeMux) {
	// 1) Serve compiled Vite build from "dist" folder
	distPath := filepath.Join(".", "dist")
	if _, err := os.Stat(distPath); os.IsNotExist(err) {
		// If dist doesn't exist, maybe we're in development mode
		// In dev, you'd just rely on Vite's dev server, so you might do nothing here
		// or provide a placeholder.
		// For production, make sure `dist` is built.
	} else {
		fileServer := http.FileServer(http.Dir(distPath))
		mux.Handle("/", fileServer)
	}

	// 2) Register your API routes
	mux.HandleFunc("/api/slides", slidesHandler)
	mux.HandleFunc("/api/login", loginHandler)
	mux.HandleFunc("/api/fetchProjects", fetchProjects)
	mux.HandleFunc("/api/addProject", addProject)
	// etc.
}

func slidesHandler(w http.ResponseWriter, r *http.Request) {
	handlers.SlidesHandler(w, r)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	handlers.LoginHandler(w, r)
}

func fetchProjects(w http.ResponseWriter, r *http.Request) {
	handlers.FetchProjects(w, r)
}

func addProject(w http.ResponseWriter, r *http.Request) {
	handlers.AddProject(w, r)
}
